import { Octokit } from 'octokit';
import { get, assign } from 'lodash-es';
import dayjs from 'dayjs';
import { to } from '@/utils/to';
import { useAppStoreHook } from '@/store/modules';
import { ElNotification } from 'element-plus';
import { ascending } from '@/utils/utils';
// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: import.meta.env.VITE_AUTH_TOKEN,
});

const owner = import.meta.env.VITE_GITHUB_OWNER;
const repo = import.meta.env.VITE_GITHUB_REPO;
const commonHeaders = {
  'X-GitHub-Api-Version': '2022-11-28',
};
const baseBranch = 'main';

const commonAuthor = {
  name: import.meta.env.VITE_COMMON_AUTHOR_NAME,
  email: import.meta.env.VITE_COMMON_AUTHOR_EMAIL,
};

export function isSuccess(res: Record<string, any>) {
  return [201, 200].includes(res.status);
}

export function buildBranch() {
  return `feature/docs-demo-${dayjs().format('YYYY-MM-DD-HH-mm')}`;
}

/**
 * 获取分支信息
 * @returns 分支信息
 */
export async function getBranch() {
  return await octokit.graphql(
    `
      query ($owner: String!, $repo: String!, $qualifiedName: String!) {
        repository(owner: $owner, name: $repo) {
          id
          ref(qualifiedName: $qualifiedName) {
            name
            target {
              ... on Commit {
                oid
                message
                committedDate
              }
            }
          }
        }
      }
    `,
    {
      owner,
      repo,
      qualifiedName: `refs/heads/${baseBranch}`,
      headers: {
        ...commonHeaders,
      },
    },
  );
}

/**
 * 创建分支
 * @param branchName
 * @returns
 */
export async function createBranch({ branchName }: { branchName: string }) {
  const [error, res] = await to(getBranch());

  if (!error && res) {
    const [e, r] = await to(
      octokit.graphql(
        `
        mutation($repositoryId: ID!, $branchName: String!, $oid: GitObjectID!) {
          createRef(input: {repositoryId: $repositoryId, name: $branchName, oid: $oid}) {
            ref {
              name
              target {
                ... on Commit {
                  oid
                  message
                  committedDate
                }
              }
            }
          }
        }
      `,
        {
          repositoryId: get(res, 'repository.id'),
          branchName: `refs/heads/${branchName}`,
          oid: get(res, 'repository.ref.target.oid', ''),
          headers: {
            ...commonHeaders,
          },
        },
      ),
    );

    if (!e && r) {
      return {
        repositoryId: get(res, 'repository.id'),
        branchName: `refs/heads/${branchName}`,
        oid: get(res, 'repository.ref.target.oid', ''),
        ref: get(r, 'createRef.ref', {}),
      };
    }

    return r;
  }

  return res;
}

export function matchSha(currentEditorFiles: any[], files) {
  let needUpdate = false;
  for (let i = 0; i < currentEditorFiles.length; i++) {
    const f = currentEditorFiles[i];

    for (let j = 0; j < files.length; j++) {
      const file = files[j];

      if (f.path === file.path) {
        file.sha = f.sha;
        // 对应提交的文件只要有一个文本有变更那么就需要更新
        if (f.playgroundCode !== file.content) {
          needUpdate = true;
          file.needUpdate = true;
        }
        break;
      }
    }
  }

  return {
    needUpdate,
    data: files.filter((file) => file.needUpdate),
  };
}

export function getFolder(currentEditorFiles: any[]) {
  if (!currentEditorFiles || currentEditorFiles.length === 0) return false;
  const path = currentEditorFiles[0].path;

  if (path) {
    const pathArr = path.split('/');

    // 我们示例目录固定为三级
    return pathArr.slice(0, 3).join('/');
  }

  return false;
}

/**
 * 创建新文件
 * @param files
 * @param branch
 * @param folder
 */
export async function createFile(
  files: { name: string; path: string; content: string; sha?: string }[],
  { branch, folder },
) {
  let isUpdate = false;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!isUpdate && file.sha) {
      isUpdate = true;
    }

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: folder ? `${folder}/${file.path}` : file.path,
      message: file.sha ? `docs: update ${file.name}` : `docs: add file ${file.name}`,
      committer: commonAuthor,
      author: commonAuthor,
      sha: file.sha ? file.sha : '',
      content: btoa(file.content),
      branch,
      headers: {
        ...commonHeaders,
      },
    });
  }

  await to(
    createPR({
      branch,
      title: isUpdate ? `update: edit ${folder} playground` : `feature: add ${folder} playground`,
      body: isUpdate ? `edit ${folder} playground` : `add ${folder} playground`,
    }),
  );
}

export function filterFolder(list: any) {
  if (!list.children || list.children.length === 0) {
    return list;
  }

  const newTree = { ...list };
  newTree.children = list.children.map((child: any) => {
    const newChild = { ...child };
    if (newChild.children && newChild.children.length > 0) {
      newChild.children = [];
    }
    return newChild;
  });

  return newTree;
}

export function filterFolders(list: any[]) {
  return list.map(filterFolder);
}

export async function updatePlayground(folder: string, content: any[], isUpdate = false) {
  const branch = buildBranch();

  const [error, data] = await to(createBranch({ branchName: branch }));

  if (!error && data) {
    // 2: 获取最新 commit 的树对象
    const [ce, cr] = await to<any>(
      octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
        owner,
        repo,
        commit_sha: data.oid,
        headers: {
          ...commonHeaders,
        },
      }),
    );

    if (!ce && cr) {
      // 3: 创建文件🌲
      const [treeError, treeRes] = await to<any>(
        octokit.request(`POST /repos/{owner}/{repo}/git/trees`, {
          owner,
          repo,
          base_tree: cr.data.tree.sha,
          tree: content.map((file) => ({
            path: folder ? `${folder}/${file.path}` : file.path,
            mode: '100644', // 普通文件权限
            type: 'blob',
            // todo: 需要判断是否是更新, 更新的话需要传入 content
            // sha: file.sha ? file.sha : '',
            // 使用文件树的话不需要 btoa
            content: file.content,
          })),
          headers: {
            ...commonHeaders,
          },
        }),
      );

      if (!treeError && treeRes) {
        // 4: 依据文件树创建commit
        const [commitError, commitRes] = await to<any>(
          octokit.request('POST /repos/{owner}/{repo}/git/commits', {
            owner,
            repo,
            message: isUpdate ? `update: edit ${folder} playground` : `feature: add ${folder} playground`,
            tree: treeRes.data.sha,
            parents: [data.oid],
            committer: commonAuthor,
            author: commonAuthor,
            headers: {
              ...commonHeaders,
            },
          }),
        );

        // 5: 更新到对应的分支
        if (!commitError && commitRes) {
          const [updateError, updateRes] = await to(
            octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
              owner,
              repo,
              ref: `heads/${branch}`,
              sha: commitRes.data.sha,
              headers: {
                ...commonHeaders,
              },
            }),
          );

          if (!updateError && updateRes) {
            // 6: 创建pr
            return await createPR({
              repositoryId: data.repositoryId,
              branch,
              title: isUpdate ? `update: edit ${folder} playground` : `feature: add ${folder} playground`,
              body: isUpdate ? `edit ${folder} playground` : `add ${folder} playground`,
            });
          }
          ElNotification({
            title: '错误',
            message: '更新ref出错',
            type: 'error',
          });
        } else {
          ElNotification({
            title: '错误',
            message: '创建 commit 出错',
            type: 'error',
          });
        }
      } else {
        ElNotification({
          title: '错误',
          message: '创建文件树出错',
          type: 'error',
        });
      }
    } else {
      ElNotification({
        title: '错误',
        message: '获取最新 commit 出错',
        type: 'error',
      });
    }
  } else {
    ElNotification({
      title: '创建分支失败',
      message: '请稍后再试',
      type: 'error',
    });
  }
}

/**
 * 获取仓库的文件目录树
 */
export async function getFileTree(sha = 'main', depth = 0, path = '') {
  if (depth > 2) return [];

  const [error, res] = await to(
    octokit.graphql(
      `
      query($owner: String!, $repo: String!, $expression: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: $expression) {
            ... on Tree {
              entries {
                mode
                path
                name
                type
                sha: oid
                object {
                  ... on Tree {
                    entries {
                      mode
                      path
                      name
                      type
                      oid
                      object {
                        ... on Tree {
                          entries {
                            mode
                            path
                            name
                            type
                            oid
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
      {
        owner,
        repo,
        expression: `${sha}:`,
        headers: {
          ...commonHeaders,
        },
      },
    ),
  );

  if (!error && res.repository) {
    const data = get(res, 'repository.object.entries', []).filter((item) => item.type === 'tree');

    const appStore = useAppStoreHook();
    const loop = (array, parent?: any) => {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];

        const p = appStore.playgroundTypes.find((pl) => pl.label === item.name);

        if (p) {
          // 给枚举数据赋值上sha
          p.sha = item.sha;
          // 给枚举数据赋值上祖先节点(第一级节点无父级)
          p.ancestors = [];
          assign(item, p);
        } else {
          assign(item, {
            collapse: true,
            ancestors: parent?.ancestors
              ? [...parent.ancestors, { name: parent.name, oid: parent.oid || parent.sha }]
              : [
                  {
                    name: parent?.name,
                    oid: parent?.oid || parent?.sha,
                  },
                ],
          });
        }

        if (item.type === 'tree' && item?.object?.entries?.length > 0) {
          item.children = loop(item.object.entries, item).filter((it: any) => !['.gitkeep'].includes(it.name));
        } else {
          item.children = null;
          item.ancestors = parent?.ancestors
            ? [...parent.ancestors, { name: parent.name, oid: parent.oid || parent.sha }]
            : [
                {
                  name: parent?.name,
                  oid: parent?.oid || parent?.sha,
                },
              ];
        }
      }

      return array;
    };

    const newData = loop(data);
    console.log(newData);

    return ascending(newData);
  }

  return [];
}

// 以下文件无需拉取，这是通用公共文件
const excludeFileName = ['index.html', 'vite.config.js', 'README.md', 'main.js', 'package.json', '.gitkeep'];

export async function getPlayground(item: any) {
  const [error, res] = await to<any>(
    octokit.graphql(
      `
      query($owner: String!, $repo: String!, $expression: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: $expression) {
            ... on Tree {
              entries {
                mode
                path
                name
                type
                sha: oid
                object {
                  ... on Blob {
                    byteSize
                    isBinary
                    text
                  }

                  ... on Tree {
                    entries {
                      mode
                      path
                      name
                      type
                      sha: oid
                      object {
                        ... on Blob {
                          byteSize
                          isBinary
                          text
                        }

                        ... on Tree {
                          entries {
                            mode
                            path
                            name
                            type
                            sha: oid
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
      {
        owner,
        repo,
        // oid: item.oid,
        expression: `${item.oid}:`,
        headers: {
          ...commonHeaders,
        },
      },
    ),
  );

  const entries = get(res, 'repository.object.entries', []);

  const tree = [];
  const buildTree = (es) => {
    for (let i = 0; i < es.length; i++) {
      const entry = es[i];

      if (entry.type === 'tree') {
        buildTree(entry.object.entries);
      } else if (entry.type === 'blob' && !excludeFileName.includes(entry.name)) {
        tree.push({
          ...entry,
          playgroundCode: entry.object.text,
          playgroundPath: entry.path,
        });
      }
    }
  };

  if (!error && entries) {
    buildTree(entries);
    return tree;
  }

  return [];
}

export async function deleteFile(file: { path: string; sha: string }) {
  await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path: file.path,
    message: 'my commit message',
    committer: commonAuthor,
    author: commonAuthor,
    sha: file.sha,
    headers: {
      ...commonHeaders,
    },
  });
}

/**
 * 在 github 创建 pr
 * todo: 需要判断是否有文件变更
 * @param repositoryId
 * @param branch
 * @param title
 * @param body
 */
export async function createPR({
  repositoryId,
  branch,
  title,
  body,
}: {
  repositoryId: string;
  branch: string;
  title: string;
  body: string;
}) {
  const res = await octokit.graphql(
    `
    mutation CreatePullRequest(
  $repositoryId: ID!,
  $baseRefName: String!,
  $headRefName: String!,
  $title: String!,
  $body: String
) {
  createPullRequest(input: {
    repositoryId: $repositoryId,
    baseRefName: $baseRefName,
    headRefName: $headRefName,
    title: $title,
    body: $body
  }) {
    pullRequest {
      url
      number
      title
      body
    }
  }
}
    `,
    {
      title,
      body,
      repositoryId,
      headRefName: branch,
      baseRefName: baseBranch,
      headers: {
        ...commonHeaders,
      },
    },
  );

  return res?.createPullRequest?.pullRequest;
}

export async function createFolder(body: { name: string; playgroundType: string; sha?: string }) {
  const branch = buildBranch();

  // 1：创建分支
  const [error, data] = await to(createBranch({ branchName: branch }));

  if (!error && data) {
    // 2: 获取最新 commit 的树对象
    const [ce, cr] = await to<any>(
      octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
        owner,
        repo,
        commit_sha: data.oid,
        headers: {
          ...commonHeaders,
        },
      }),
    );

    if (!ce && cr) {
      // 3: 创建文件🌲
      const [treeError, treeRes] = await to<any>(
        octokit.request(`POST /repos/{owner}/{repo}/git/trees`, {
          owner,
          repo,
          base_tree: cr.data.tree.sha,
          tree: [
            {
              path: `${body.playgroundType}/${body.name}/.gitkeep`,
              mode: '100644', // 普通文件权限
              type: 'blob',
              content: btoa(``),
              // content: Buffer.from('').toString('base64'),
            },
          ],
          headers: {
            ...commonHeaders,
          },
        }),
      );

      if (!treeError && treeRes) {
        // 4: 依据文件树创建commit
        const [commitError, commitRes] = await to<any>(
          octokit.request('POST /repos/{owner}/{repo}/git/commits', {
            owner,
            repo,
            message: 'docs: add folder',
            tree: treeRes.data.sha,
            parents: [data.oid],
            committer: commonAuthor,
            author: commonAuthor,
            headers: {
              ...commonHeaders,
            },
          }),
        );

        // 5: 更新到对应的分支
        if (!commitError && commitRes) {
          const [updateError, updateRes] = await to(
            octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
              owner,
              repo,
              ref: `heads/${branch}`,
              sha: commitRes.data.sha,
              headers: {
                ...commonHeaders,
              },
            }),
          );

          if (!updateError && updateRes) {
            // 6: 创建pr
            await to(
              createPR({
                repositoryId: data.repositoryId,
                branch,
                title: `update: add folder ${body.playgroundType}/${body.name}`,
                body: `add folder ${body.playgroundType}/${body.name}`,
              }),
            );
          } else {
            ElNotification({
              title: '错误',
              message: '更新ref出错',
              type: 'error',
            });
          }
        } else {
          ElNotification({
            title: '错误',
            message: '创建 commit 出错',
            type: 'error',
          });
        }
      } else {
        ElNotification({
          title: '错误',
          message: '创建文件树出错',
          type: 'error',
        });
      }
    } else {
      ElNotification({
        title: '错误',
        message: '获取最新 commit 出错',
        type: 'error',
      });
    }
  } else {
    ElNotification({
      title: '错误',
      message: '创建分支出错',
      type: 'error',
    });
  }
}

export async function updateFolder(body) {
  console.log(body);
}

/**
 * 获取所有 playground 列表
 * http://examples.maptalks.com/thumbnails/basic_ui-control_infowindow-scroll.webp
 * @returns
 */
export async function getPlaygroundList() {
  return [
    {
      name: 'basic',
      title: {
        cn: '基础功能',
        en: 'Basic',
      },
      examples: [
        {
          name: 'map',
          title: {
            cn: '地图',
            en: 'Map',
          },
          examples: [
            {
              name: 'load',
              title: {
                cn: '显示',
                en: 'Display a map',
              },
            },
            {
              name: 'pitch-rotate',
              title: {
                cn: '倾斜与旋转',
                en: 'Pitch and rotate',
              },
            },
            {
              name: 'drag-pitch-rotate',
              title: {
                cn: '拖动倾斜与旋转',
                en: 'Drag to pitch and rotate',
              },
            },
            {
              name: 'panning',
              title: {
                cn: '移动地图',
                en: 'Map panning',
              },
            },
            {
              name: 'common-control',
              title: {
                cn: '添加常用控件',
                en: 'Add common controls',
              },
            },
            {
              name: 'status',
              title: {
                cn: '获取地图状态',
                en: "Get map's status",
              },
            },
            {
              name: 'fit-extent',
              title: {
                cn: '自动适配区域',
                en: 'Fit to extent',
              },
            },
            {
              name: 'limit-extent',
              title: {
                cn: '限制地图区域',
                en: "Limit map's extent",
              },
            },
            {
              name: 'limit-zoom',
              title: {
                cn: '限制缩放级别',
                en: "Limit map's zoom",
              },
            },
            {
              name: 'fractional-zoom',
              title: {
                cn: '细微缩放(Fractional Zoom)',
                en: 'Fractional zoom',
              },
            },
            {
              name: 'canvas',
              title: {
                cn: '在Canvas容器中加载',
                en: 'Load on Canvas',
              },
            },
            {
              name: 'map-events',
              title: {
                cn: '监听地图事件',
                en: 'Listen map events',
              },
            },
            {
              name: 'sync-map',
              title: {
                cn: '同步地图',
                en: 'Sync map by events',
              },
            },
            {
              name: 'coordinate-conversion',
              title: {
                cn: '屏幕坐标转换',
                en: 'Convert to screen points',
              },
            },
            {
              name: 'export-image',
              title: {
                cn: '导出为图片',
                en: 'Export map as images',
              },
            },
            {
              name: 'map-magnifier',
              title: {
                cn: '地图放大镜',
                en: "Map's magnifier",
              },
            },
            {
              name: 'custom-resolutions',
              title: {
                cn: '自定义地图LOD',
                en: "Customize map's resolutions",
              },
            },
            {
              name: 'map-scale-container',
              title: {
                cn: '缩放地图容器解决高分辨率地图卡顿',
                en: 'scale container for high resolution',
              },
            },
          ],
        },
        {
          name: 'tilelayer-projection',
          title: {
            cn: '瓦片图层与地理投影',
            en: 'TileLayer and Geo-Projections',
          },
          examples: [
            {
              name: 'canvas-renderer',
              title: {
                cn: 'Canvas渲染方式的瓦片图层',
                en: 'TileLayer with Canvas renderer',
              },
            },
            {
              name: 'multi-tilelayer',
              title: {
                cn: '添加多个瓦片图层',
                en: 'Add multiple TileLayers',
              },
            },
            {
              name: 'grouptilelayer',
              title: {
                cn: '添加瓦片图层组',
                en: 'Add GroupTileLayer',
              },
            },
            {
              name: 'wms',
              title: {
                cn: 'WMS瓦片图层',
                en: 'Add a WMS TileLayer',
              },
            },
            {
              name: 'wms-reload',
              title: {
                cn: 'TileLayer强制重载',
                en: 'TileLayer projection wms reload',
              },
            },
            {
              name: 'vector-tile',
              title: {
                cn: 'Vector-Tile图层',
                en: 'Add a mapbox vector-tile Layer',
              },
              url: 'https://github.com/maptalks/maptalks.mapboxgl',
            },
            {
              name: 'arcgis-tile',
              title: {
                cn: 'ArcGIS瓦片图层',
                en: 'Add an ArcGIS TileLayer',
              },
            },
            {
              name: 'wmts-tile',
              title: {
                cn: 'WMTS瓦片图层',
                en: 'Add a WMTS TileLayer',
              },
              mark: 'new',
            },
            {
              name: 'custom-tile',
              title: {
                cn: 'LOD和自定义瓦片图层',
                en: 'LOD and custom TileLayer',
              },
            },
            {
              name: 'base64',
              title: {
                cn: '用base64编码载入瓦片',
                en: 'Load tiles with base64 encoding',
              },
            },
            {
              name: 'tile-opacity',
              title: {
                cn: '设置瓦片图层透明度',
                en: "Set TileLayer's opacity",
              },
            },
            {
              name: 'tile-mask',
              title: {
                cn: '只显示指定范围内的瓦片',
                en: 'Set a boundary mask to TileLayer',
              },
            },
            {
              name: 'epsg4326',
              title: {
                cn: '4326投影底图',
                en: 'TileLayer of EPSG:4326 projection',
              },
            },
            {
              name: 'identity',
              title: {
                cn: 'IDENTITY投影底图',
                en: 'TileLayer of IDENTITY projection',
              },
            },
            {
              name: 'baidu',
              title: {
                cn: '百度投影底图',
                en: 'TileLayer of Baidu Projection',
              },
            },
            {
              name: 'proj4js',
              title: {
                cn: 'Proj4js自定义投影底图',
                en: 'TileLayer of custom projection by proj4js',
              },
            },
            {
              name: 'd3-proj',
              title: {
                cn: 'D3投影',
                en: 'D3 geo projection',
              },
            },
            {
              name: 'different-projection',
              title: {
                cn: '载入不同投影的TileLayer',
                en: 'Load tilelayer with different projection',
              },
            },
            {
              name: 'filter',
              title: {
                cn: '底图风格滤镜',
                en: "TileLayer's CSS filter",
              },
            },
            {
              name: 'tile-image-custom',
              title: {
                cn: '自定义处理瓦片图片',
                en: 'Custom processing of tile images',
              },
            },
            {
              name: 'max-zoom',
              title: {
                cn: '增大空间参考的maxZoom',
                en: 'Larger maxZoom of spatialReference',
              },
            },
          ],
        },
        {
          name: 'geometry',
          title: {
            cn: '图形',
            en: 'Geometry',
          },
          examples: [
            {
              name: 'marker',
              title: {
                cn: 'Marker',
                en: 'Marker',
              },
            },
            {
              name: 'linestring',
              title: {
                cn: 'LineString',
                en: 'LineString',
              },
            },
            {
              name: 'polygon',
              title: {
                cn: 'Polygon',
                en: 'Polygon',
              },
            },
            {
              name: 'collection',
              title: {
                cn: 'GeometryCollection',
                en: 'GeometryCollection',
              },
            },
            {
              name: 'multipoint',
              title: {
                cn: 'MultiPoint',
                en: 'MultiPoint',
              },
            },
            {
              name: 'multilinestring',
              title: {
                cn: 'MultiLineString',
                en: 'MultiLineString',
              },
            },
            {
              name: 'multipolygon',
              title: {
                cn: 'MultiPolygon',
                en: 'MultiPolygon',
              },
            },
            {
              name: 'rectangle-circle-ellipse-sector',
              title: {
                cn: '矩形, 圆形, 椭圆和扇形',
                en: 'Rectangle, Circle, Ellipse and Sector',
              },
            },
            {
              name: 'curve',
              title: {
                cn: '圆弧和贝塞尔曲线',
                en: 'Arc and Bezier Curves',
              },
            },
            {
              name: 'label',
              title: {
                cn: '文字标签(Label)',
                en: 'Label',
              },
            },
            {
              name: 'textbox',
              title: {
                cn: '文本框(TextBox)',
                en: 'TextBox',
              },
            },
            {
              name: 'connector-line',
              title: {
                cn: '连接线',
                en: 'Connector Lines',
              },
            },
            {
              name: 'copy',
              title: {
                cn: '克隆',
                en: 'Copy a geometry',
              },
            },
            {
              name: 'events',
              title: {
                cn: '监听图形事件',
                en: 'Listen geometry events',
              },
            },
            {
              name: 'flash-geometry',
              title: {
                cn: '闪烁',
                en: 'Flash a geometry',
              },
            },
            {
              name: 'collection-filter',
              title: {
                cn: 'GeometryCollection的条件查询',
                en: 'Filter GeometryCollection by condition',
              },
            },
          ],
        },
        {
          name: '3d',
          title: {
            cn: '三维',
            en: '3D',
          },
          examples: [
            {
              name: 'marker-altitude',
              title: {
                cn: '有高度的Marker',
                en: 'Marker with altitude',
              },
            },
            {
              name: 'marker-draw-altitude',
              title: {
                cn: '绘制Marker的高度线',
                en: "Draw marker's altitude",
              },
            },
            {
              name: 'line-altitude',
              title: {
                cn: '有高度的线',
                en: 'LineString with altitude',
              },
            },
            {
              name: 'line-draw-altitude',
              title: {
                cn: '绘制Line的高度面',
                en: "Draw line's altitude wall",
              },
            },
            {
              name: 'polygon-altitude',
              title: {
                cn: '有高度的多边形',
                en: 'Polygon with altitude',
              },
            },
            {
              name: 'set-altitude',
              title: {
                cn: '设置图形高度',
                en: 'Set geom altitude',
              },
            },
          ],
        },
        {
          name: 'style',
          title: {
            cn: '图形样式',
            en: 'Geometry Styles',
          },
          examples: [
            {
              name: 'image-marker',
              title: {
                cn: '图片标注',
                en: 'Image marker',
              },
            },
            {
              name: 'multi-image-marker',
              title: {
                cn: '多图片标注',
                en: 'Multiple-image marker',
              },
            },
            {
              name: 'vector-marker',
              title: {
                cn: '矢量标注',
                en: 'Vector marker',
              },
            },
            {
              name: 'vector-pattern',
              title: {
                cn: '矢量标注模式填充',
                en: 'Vector marker with pattern fill',
              },
            },
            {
              name: 'vector-gradient',
              title: {
                cn: '矢量标注渐变填充',
                en: 'Vector marker with gradient fill',
              },
            },
            {
              name: 'svg-path-marker',
              title: {
                cn: 'SVG矢量标注',
                en: 'SVG vector marker',
              },
            },
            {
              name: 'marker-alignment',
              title: {
                cn: '标注水平和垂直对齐',
                en: "Marker's horizontal and vertical alignment",
              },
            },
            {
              name: 'rotate-marker',
              title: {
                cn: '旋转标注',
                en: 'Rotate a marker',
              },
            },
            {
              name: 'text-marker',
              title: {
                cn: '文字标注',
                en: 'Text marker',
              },
            },
            {
              name: 'rotate-text',
              title: {
                cn: '旋转文字标注',
                en: 'Rotate a text marker',
              },
            },
            {
              name: 'image-text-marker',
              title: {
                cn: '带文字的图片标注',
                en: 'Image marker with texts',
              },
            },
            {
              name: 'line-symbol',
              title: {
                cn: '线样式',
                en: 'Line symbol',
              },
            },
            {
              name: 'line-pattern',
              title: {
                cn: '线的模式填充',
                en: 'Line pattern fill',
              },
            },
            {
              name: 'line-pattern-animation',
              title: {
                cn: '线的模式填充动画',
                en: 'Animation of line pattern fill',
              },
            },
            {
              name: 'line-gradient',
              title: {
                cn: '线的渐变填充',
                en: 'Line gradient fill',
              },
            },
            {
              name: 'line-arrow',
              title: {
                cn: '带箭头的线',
                en: 'Line with arrows',
              },
            },
            {
              name: 'line-text',
              title: {
                cn: '带文字的线',
                en: 'Line with texts',
              },
            },
            {
              name: 'line-marker',
              title: {
                cn: '端点沿线自动旋转Marker',
                en: 'Line of vertex marker with auto rotation',
              },
            },
            {
              name: 'line-smoothness',
              title: {
                cn: '线的曲线平滑',
                en: 'Smooth line with curve',
              },
            },
            {
              name: 'polygon-symbol',
              title: {
                cn: '面样式',
                en: 'Polygon symbol',
              },
            },
            {
              name: 'polygon-pattern',
              title: {
                cn: '面的模式填充',
                en: 'Polygon pattern fill',
              },
            },
            {
              name: 'polygon-gradient',
              title: {
                cn: '面的渐变填充',
                en: 'Polygon gradient fill',
              },
            },
            {
              name: 'polygon-vertex-marker',
              title: {
                cn: '面的端点样式',
                en: 'Polygon with vetex markers',
              },
            },
            {
              name: 'composite-symbol',
              title: {
                cn: '组合样式',
                en: 'Composite symbol',
              },
            },
            {
              name: 'update-symbol',
              title: {
                cn: '样式的部分更新',
                en: 'Update part of symbol',
              },
            },
            {
              name: 'symbol-by-zoom',
              title: {
                cn: '根据zoom设置样式',
                en: 'Symbol by map zoom',
              },
            },
            {
              name: 'symbol-by-prop',
              title: {
                cn: '根据属性数据设置样式',
                en: 'Symbol by geometry properties',
              },
            },
            {
              name: 'color-interpolate',
              title: {
                cn: '颜色插值',
                en: 'Color interpolate',
              },
            },
            {
              name: 'html-marker',
              title: {
                cn: 'HTML自定义标注',
                en: 'Marker with HTML content',
              },
            },
            {
              name: 'd3-marker',
              title: {
                cn: 'D3图表样式',
                en: 'Marker with D3 chart',
              },
            },
            {
              name: 'echarts-marker',
              title: {
                cn: 'Echarts图表样式',
                en: 'Marker with echarts',
              },
            },
            {
              name: 'highcharts-marker',
              title: {
                cn: 'Highcharts图表样式',
                en: 'Marker with highcharts',
              },
            },
          ],
        },
        {
          name: 'layer',
          title: {
            cn: '图层',
            en: 'Layer',
          },
          examples: [
            {
              name: 'add-remove',
              title: {
                cn: '添加图层和移除图层',
                en: 'Add and remove layers',
              },
            },
            {
              name: 'show-hide',
              title: {
                cn: '隐藏显示图层',
                en: 'Show and hide layers',
              },
            },
            {
              name: 'opacity',
              title: {
                cn: '设置图层透明度',
                en: "Set layer's opacity",
              },
            },
            {
              name: 'bring-front-back',
              title: {
                cn: '图层置顶或置底',
                en: 'Bring layers to front or back',
              },
            },
            {
              name: 'sort',
              title: {
                cn: '改变图层叠加顺序',
                en: 'Sort layers',
              },
            },
            {
              name: 'mask',
              title: {
                cn: '用鼠标设置图层遮罩',
                en: 'Set layer mask as mouse event',
              },
            },
            {
              name: 'globalcompositeoperation',
              title: {
                cn: 'globalCompositeOperation',
                en: "Layer's globalCompositeOperation",
              },
            },
            {
              name: 'vectorlayer-batch-add',
              title: {
                cn: 'VectorLayer: 批量添加图形',
                en: 'VectorLayer: Batch add geometries',
              },
            },
            {
              name: 'vectorlayer-get-by-id',
              title: {
                cn: 'VectorLayer:根据 ID 获取图形',
                en: 'VectorLayer: Get geometry by ID',
              },
            },
            {
              name: 'vectorlayer-filter',
              title: {
                cn: 'VectorLayer: 根据属性条件筛选图形',
                en: 'VectorLayer: Filter geometries by property condition',
              },
            },
            {
              name: 'vectorlayer-style',
              title: {
                cn: 'VectorLayer: 批量设置图形样式',
                en: 'VectorLayer: Batch style geometries',
              },
            },
            {
              name: 'vectorlayer-sort',
              title: {
                cn: 'VectorLayer: 设置图形的z-index',
                en: "VectorLayer: Set geomtries' z-index",
              },
            },
            {
              name: 'collision',
              title: {
                cn: '碰撞',
                en: 'layer collision',
              },
            },
            {
              name: 'canvaslayer',
              title: {
                cn: 'CanvasLayer: 画板图层示例',
                en: 'CanvasLayer: an example',
              },
            },
            {
              name: 'particlelayer',
              title: {
                cn: 'ParticleLayer: 粒子图层示例',
                en: 'ParticleLayer: an example',
              },
            },
            {
              name: 'canvastilelayer',
              title: {
                cn: 'CanvasTileLayer: 画板瓦片图层示例',
                en: 'CanvasTileLayer: an example',
              },
            },
            {
              name: 'swipe',
              title: {
                cn: '图层卷帘效果',
                en: 'Layer swipe effect',
              },
            },
            {
              name: 'imagelayer',
              title: {
                cn: 'ImageLayer: 图片图层示例',
                en: 'ImageLayer: an example',
              },
            },
          ],
        },
        {
          name: 'utils',
          title: {
            cn: '工具/全局功能',
            en: 'Utils/global',
          },
          examples: [
            {
              name: 'options-proxy',
              title: {
                cn: '通过Proxy更新options',
                en: 'Update options by Proxy',
              },
            },
          ],
        },
        {
          name: 'interaction',
          title: {
            cn: '交互',
            en: 'User Interactions',
          },
          examples: [
            {
              name: 'map-off',
              title: {
                cn: '禁用所有交互',
                en: "Disable map's interaction",
              },
            },
            {
              name: 'map-on-off',
              title: {
                cn: '地图功能开关',
                en: 'Turn on/off map interaction capabilities',
              },
            },
            {
              name: 'distance-tool',
              title: {
                cn: '测距工具',
                en: 'Distance tool to measure distance',
              },
            },
            {
              name: 'area-tool',
              title: {
                cn: '测面工具',
                en: 'Area tool to measure area',
              },
            },
            {
              name: 'draw-tool',
              title: {
                cn: '绘制工具',
                en: 'Draw tool to draw geometries',
              },
            },
            {
              name: 'drag-geometries',
              title: {
                cn: '拖拽图形',
                en: 'Drag geometries',
              },
            },
            {
              name: 'edit-marker',
              title: {
                cn: '编辑标注',
                en: 'Edit marker',
              },
            },
            {
              name: 'edit-line',
              title: {
                cn: '编辑线',
                en: 'Edit LineString',
              },
            },
            {
              name: 'edit-polygon',
              title: {
                cn: '编辑多边形',
                en: 'Edit Polygon',
              },
            },
            {
              name: 'edit-rectangle-circle-ellipse',
              title: {
                cn: '编辑矩形/圆形/椭圆',
                en: 'Edit Rectangle/Circle/Elliipse',
              },
            },
            {
              name: 'edit-textbox',
              title: {
                cn: '编辑文本框',
                en: "Edit TextBox's shape",
              },
            },
            {
              name: 'edit-label',
              title: {
                cn: '编辑文本内容',
                en: "Edit Label and TextBox's content",
              },
            },
            {
              name: 'mouse-identify',
              title: {
                cn: '鼠标点选图形',
                en: 'Identify geometries by mouse click',
              },
            },
            {
              name: 'mouse-highlight',
              title: {
                cn: '鼠标悬停高亮图形',
                en: 'Highlight a geometry by mouseover',
              },
            },
            {
              name: 'mouse-contains',
              title: {
                cn: '鼠标与图形的空间关系',
                en: 'Spatial relation between mouse and geometries',
              },
            },
          ],
        },
        {
          name: 'animation',
          title: {
            cn: '动画',
            en: 'Animation',
          },
          examples: [
            {
              name: 'map-flyto',
              title: {
                cn: '地图飞行到指定位置',
                en: "Fly map's camera to a location",
              },
            },
            {
              name: 'marker-anim',
              title: {
                cn: 'Marker的变形动画',
                en: "Marker's shape animation",
              },
            },
            {
              name: 'move-along',
              title: {
                cn: '点的沿线动画',
                en: 'Marker animation along a line',
              },
            },
            {
              name: 'geometry-anim',
              title: {
                cn: 'Geometry.animate方法',
                en: 'Geometry.animate method',
              },
            },
            {
              name: 'line-animateshow',
              title: {
                cn: '线的动画展现',
                en: "LineString's animateShow",
              },
            },
            {
              name: 'polygon-animateshow',
              title: {
                cn: '面的动画展现',
                en: "Polygon's animateShow",
              },
            },
            {
              name: 'custom-anim',
              title: {
                cn: '自定义动画',
                en: 'Custom animation',
              },
            },
            {
              name: 'map-view-follow',
              title: {
                cn: '地图跟随动画',
                en: 'map-view-follow animation',
              },
            },
          ],
        },
        {
          name: 'ui-control',
          title: {
            cn: '空间与UI组件',
            en: 'Control and UIComponents',
          },
          examples: [
            {
              name: 'ui-map-menu',
              title: {
                cn: '地图右键菜单',
                en: "Map's context menu",
              },
            },
            {
              name: 'ui-geo-menu',
              title: {
                cn: '图形右键菜单',
                en: "Geometry's context menu",
              },
            },
            {
              name: 'ui-custom-menu',
              title: {
                cn: '自定义右键菜单',
                en: 'Custom context menu',
              },
            },
            {
              name: 'ui-map-infownd',
              title: {
                cn: '地图信息框',
                en: "Map's InfoWindow",
              },
            },
            {
              name: 'ui-geo-infownd',
              title: {
                cn: '图形信息框',
                en: "Geometry's InfoWindow",
              },
            },
            {
              name: 'ui-custom-infownd',
              title: {
                cn: '自定义信息框',
                en: 'Custom InfoWindow',
              },
            },
            {
              name: 'infowindow-scroll',
              title: {
                cn: '信息框内容支持滚动',
                en: 'InfoWindow content support wheelscroll',
              },
            },
            {
              name: 'uimarker-align',
              title: {
                cn: 'UIMarker 对齐',
                en: 'UIMarker align',
              },
            },
            {
              name: 'ui-collision',
              title: {
                cn: 'UI碰撞',
                en: 'UI collision',
              },
            },
            {
              name: 'ui-geo-infownd-bind-mvvm-component',
              title: {
                cn: '信息框绑定MVVM组件',
                en: 'InfoWindow bind MVVM component',
              },
            },
            {
              name: 'uimarker-mvvm-dynamic',
              title: {
                cn: 'UIMarker绑定MVVM组件',
                en: 'UIMarker bind MVVM component',
              },
            },
            {
              name: 'control-toolbar',
              title: {
                cn: 'Toolbar控件',
                en: 'Toolbar Control',
              },
            },
            {
              name: 'control-panel',
              title: {
                cn: 'Panel控件',
                en: 'Panel Control',
              },
            },
            {
              name: 'control-overview',
              title: {
                cn: '鹰眼控件',
                en: 'Overview Control',
              },
            },
            {
              name: 'control-zoom',
              title: {
                cn: 'Zoom控件',
                en: 'Zoom Control',
              },
            },
            {
              name: 'control-compass',
              title: {
                cn: '指北针控件',
                en: 'Compass Control',
              },
            },
            {
              name: 'control-scale',
              title: {
                cn: 'Scale控件',
                en: 'Scale Control',
              },
            },
            {
              name: 'control-attribution',
              title: {
                cn: 'Attribution控件',
                en: 'Attribution Control',
              },
            },
            {
              name: 'control-show-hide',
              title: {
                cn: '控件显示与隐藏',
                en: 'Show and hide controls',
              },
            },
            {
              name: 'control-layer-switcher',
              title: {
                cn: '图层选择控件',
                en: 'Layer Switcher',
              },
            },
          ],
        },
        {
          name: 'json',
          title: {
            cn: 'JSON序列化',
            en: 'JSON Serialization',
          },
          examples: [
            {
              name: 'geojson-to-geometry',
              title: {
                cn: 'GeoJSON转化为Geometry',
                en: 'GeoJSON to geometries',
              },
            },
            {
              name: 'geometry-to-geojson',
              title: {
                cn: 'Geometry转化为GeoJSON',
                en: 'Geometries to GeoJSON',
              },
            },
            {
              name: 'map-to-json',
              title: {
                cn: '地图转化为JSON',
                en: 'Map to JSON',
              },
            },
            {
              name: 'json-to-map',
              title: {
                cn: '用JSON载入地图',
                en: 'Map from JSON',
              },
            },
            {
              name: 'copy-map',
              title: {
                cn: '用JSON复制地图',
                en: 'Copy map by JSON',
              },
            },
            {
              name: 'layer-json',
              title: {
                cn: '用JSON复制Layer',
                en: 'Copy layer by JSON',
              },
            },
            {
              name: 'geometry-json',
              title: {
                cn: '用JSON复制Geometry',
                en: 'Copy geometry by JSON',
              },
            },
          ],
        },
        {
          name: 'plugin',
          title: {
            cn: '常用插件',
            en: 'Common Plugins',
          },
          examples: [
            {
              name: 'mapboxgl',
              title: {
                cn: 'Mapbox gl 图层',
                en: 'Mapbox gl Layer',
              },
              url: 'https://github.com/maptalks/maptalks.mapboxgl',
            },
            {
              name: 'heatmaplayer',
              title: {
                cn: 'HeatLayer: 热力图层示例',
                en: 'Heatmap Layer',
              },
              url: 'https://github.com/maptalks/maptalks.heatmap',
            },
            {
              name: 'clusterlayer',
              title: {
                cn: 'ClusterLayer: 点聚合图层示例',
                en: 'Marker Cluster Layer',
              },
              url: 'https://github.com/maptalks/maptalks.markercluster',
            },
            {
              name: 'three',
              title: {
                cn: 'Three.js 图层',
                en: 'THREE.js Layer',
              },
              url: 'https://github.com/maptalks/maptalks.three',
            },
            {
              name: 'echarts',
              title: {
                cn: 'Echarts 图层',
                en: 'Echarts Layer',
              },
              url: 'https://github.com/maptalks/maptalks.e3',
            },
          ],
        },
        {
          name: 'plugin-develop',
          title: {
            cn: '插件开发示例',
            en: 'Plugin development',
          },
          examples: [
            {
              name: 'control',
              title: {
                cn: '创建新的控件',
                en: 'New control',
              },
            },
            {
              name: 'ui',
              title: {
                cn: '创建新的UI组件',
                en: 'New UI Component',
              },
            },
            {
              name: 'maptool',
              title: {
                cn: '创建地图工具',
                en: 'New MapTool',
              },
            },
          ],
        },
        {
          name: 'hellolayer',
          title: {
            cn: '图层开发示例',
            en: 'Layer development',
          },
          examples: [
            {
              name: 'layer',
              title: {
                cn: 'HelloLayer',
                en: 'HelloLayer',
              },
            },
            {
              name: 'drawoninteracting',
              title: {
                cn: 'HelloLayer交互绘制',
                en: 'HelloLayer with drawOnInteracting',
              },
            },
            {
              name: 'animation',
              title: {
                cn: 'HelloLayer动画图层',
                en: 'HelloLayer with animation',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'vector',
      title: {
        cn: '矢量瓦片及点线面图层',
        en: 'Vector',
      },
      examples: [
        {
          name: 'operation',
          title: {
            cn: '图层操作',
            en: 'Layer operation',
          },
          examples: [
            {
              name: 'add-remove',
              title: {
                cn: '添加和移除图层',
                en: 'Add and remove layer',
              },
            },
            {
              name: 'show-hide',
              title: {
                cn: '显示和隐藏图层',
                en: 'Show and hide layer',
              },
            },
            {
              name: 'zoom-interval',
              title: {
                cn: '设置图层缩放区间',
                en: 'Set layer zoom interval',
              },
            },
            {
              name: 'features',
              title: {
                cn: '获取瓦片feature数据',
                en: 'Get feature data',
              },
            },
            {
              name: 'available-zoom',
              title: {
                cn: '设置图层最大可访问级别',
                en: 'Set the max access zoom',
              },
            },
            {
              name: 'layer-json',
              title: {
                cn: '图层转化为JSON',
                en: 'Layer to JSON',
              },
            },
            {
              name: 'json-layer',
              title: {
                cn: '用JSON载入图层',
                en: 'JSON to layer',
              },
            },
          ],
        },
        {
          name: 'vtlayer',
          title: {
            cn: '矢量瓦片图层',
            en: 'VectorTileLayer',
          },
          examples: [
            {
              name: 'load-mapbox',
              title: {
                cn: '载入mapbox矢量瓦片数据',
                en: 'Load mapbox vector tile data',
              },
            },
            {
              name: 'load-maptiler',
              title: {
                cn: '载入maptiler矢量瓦片数据',
                en: 'Load maptiler vector tile data',
              },
            },
            {
              name: 'load-maptiler-4326',
              title: {
                cn: '载入maptiler4326瓦片数据',
                en: 'Load maptiler 4326 vector tile data',
              },
            },
          ],
        },
        {
          name: 'vt-visual',
          title: {
            cn: '矢量瓦片图层可视化',
            en: 'Vector tile layer visualization',
          },
          examples: [
            {
              name: 'road',
              title: {
                cn: '道路',
                en: 'Road',
              },
            },
            {
              name: 'process',
              title: {
                cn: '地图后处理',
                en: 'Post process',
              },
            },
          ],
        },
        {
          name: 'geo',
          title: {
            cn: 'GeoJSONVectorTileLayer',
            en: 'GeoJSONVectorTileLayer',
          },
          examples: [
            {
              name: 'load-local',
              title: {
                cn: '载入GeoJSON对象数据',
                en: 'Load GeoJSON object data',
              },
            },
            {
              name: 'load-remote',
              title: {
                cn: '载入远程GeoJSON数据',
                en: 'Load remote GeoJSON data',
              },
            },
            {
              name: 'transform-function',
              title: {
                cn: '数据转换函数',
                en: 'Data transform function',
              },
            },
            {
              name: 'load-event',
              title: {
                cn: '数据加载完成',
                en: 'Data load event',
              },
            },
          ],
        },
        {
          name: 'style',
          title: {
            cn: '样式操作',
            en: 'Style operation',
          },
          examples: [
            {
              name: 'filter-data',
              title: {
                cn: '筛选符合条件的数据',
                en: 'Filter data',
              },
            },
            {
              name: 'plugin',
              title: {
                cn: '选择渲染插件样式',
                en: 'Change render plugin',
              },
            },
            {
              name: 'set-style',
              title: {
                cn: '样式整体更新',
                en: 'Set style',
              },
            },
            {
              name: 'update-symbol',
              title: {
                cn: '样式部分更新',
                en: 'Update symbol',
              },
            },
            {
              name: 'update-data-config',
              title: {
                cn: '更新dataConfig',
                en: 'Update data config',
              },
            },
            {
              name: 'update-scene-config',
              title: {
                cn: '更新sceneConfig',
                en: 'Update scene config',
              },
            },
            {
              name: 'remove-style',
              title: {
                cn: '移除图层样式',
                en: 'Remove layer style',
              },
            },
            {
              name: 'hide-feature',
              title: {
                cn: '单独隐藏Feature',
                en: 'Hide feature',
              },
            },
            {
              name: 'set-feature-style',
              title: {
                cn: '单独设置Feature的样式',
                en: 'Set feature style',
              },
            },
            {
              name: 'update-feature-style',
              title: {
                cn: '更新Feature的样式',
                en: 'Update feature style',
              },
            },
          ],
        },
        {
          name: 'interactive',
          title: {
            cn: '图层交互',
            en: 'layer interactive',
          },
          examples: [
            {
              name: 'highlight',
              title: {
                cn: '高亮元素',
                en: 'highlight feature',
              },
            },
            {
              name: 'highlight-filter',
              title: {
                cn: '高亮元素-filter',
                en: 'highlight feature filter',
              },
            },
            {
              name: 'hide-feature',
              title: {
                cn: '元素显示与隐藏',
                en: 'hide/show feature',
              },
            },
            {
              name: 'identify',
              title: {
                cn: '获取元素信息',
                en: 'get feature data',
              },
            },
            {
              name: 'mousemove',
              title: {
                cn: '鼠标动态交互',
                en: 'highlight by mouseevent',
              },
            },
            {
              name: 'tooltip',
              title: {
                cn: '模拟 Tooltip',
                en: 'Simulate Tooltip',
              },
            },
            {
              name: 'multilayer',
              title: {
                cn: '多个图层',
                en: 'multi layer',
              },
            },
            {
              name: 'event-proxy',
              title: {
                cn: '给图层派发事件',
                en: 'fire layer event',
              },
            },
            {
              name: 'merge-data',
              title: {
                cn: '合并geojson',
                en: 'merge geojson',
              },
            },
            {
              name: 'geometry',
              title: {
                cn: '获取geojson geometry',
                en: 'get geojson geometry',
              },
            },
            {
              name: 'altitude',
              title: {
                cn: '查询高程',
                en: 'query altitude',
              },
            },
            {
              name: 'altitude-water',
              title: {
                cn: '查询高程-水',
                en: 'query water altitude',
              },
            },
          ],
        },
        {
          name: 'pointstyle',
          title: {
            cn: '点类型数据样式',
            en: 'Point style',
          },
          examples: [
            {
              name: 'multiple-icon',
              title: {
                cn: '组合多个图标',
                en: 'Composite multiple icons',
              },
            },
            {
              name: 'icon-text',
              title: {
                cn: '组合图标和文字',
                en: 'Composite icon and text',
              },
            },
            {
              name: 'scale',
              title: {
                cn: '图标和文字随地图缩放',
                en: 'Scale with map',
              },
            },
            {
              name: 'pitch',
              title: {
                cn: '图标和文字随地图倾斜',
                en: 'Pitch with map',
              },
            },
            {
              name: 'rotate',
              title: {
                cn: '图标和文字随地图旋转',
                en: 'Rotate with map',
              },
            },
            {
              name: 'specified-levels',
              title: {
                cn: '只在指定的级别上显示',
                en: 'Show only on specified levels',
              },
            },
            {
              name: 'different-icons',
              title: {
                cn: '不同属性显示不同的图标',
                en: 'Different icons by props',
              },
            },
            {
              name: 'read-icon',
              title: {
                cn: '从属性数据中读取图标',
                en: 'Read icon from props',
              },
            },
            {
              name: 'read-text',
              title: {
                cn: '从属性数据中读取文字',
                en: 'Read text from props',
              },
            },
            {
              name: 'across-collision',
              title: {
                cn: '跨图层的碰撞检测',
                en: 'Collision detection across layers',
              },
            },
          ],
        },
        {
          name: 'linestyle',
          title: {
            cn: '线类型数据样式',
            en: 'Line style',
          },
          examples: [
            {
              name: 'stroke-style',
              title: {
                cn: '设置描边样式',
                en: 'Set stroke style',
              },
            },
            {
              name: 'draw-text',
              title: {
                cn: '沿线绘制文字',
                en: 'Draw text along the line',
              },
            },
            {
              name: 'width-zoom',
              title: {
                cn: '宽度随地图级别变化',
                en: 'Width varies with zoom',
              },
            },
            {
              name: 'color-zoom',
              title: {
                cn: '颜色随地图级别变化',
                en: 'Color varies with zoom',
              },
            },
            {
              name: 'property',
              title: {
                cn: '根据属性数据设置样式',
                en: 'Set layer by property',
              },
            },
            {
              name: 'texture',
              title: {
                cn: '纹理动画',
                en: 'Texture animation',
              },
            },
            {
              name: 'bloom',
              title: {
                cn: '开启泛光',
                en: 'Enable bloom',
              },
            },
          ],
        },
        {
          name: 'polygonstyle',
          title: {
            cn: '面类型数据样式',
            en: 'Polygon style',
          },
          examples: [
            {
              name: 'border-style',
              title: {
                cn: '设置面的边框样式',
                en: 'Set the border style of the polygon',
              },
            },
            {
              name: 'texture',
              title: {
                cn: '设置纹理',
                en: 'Set texture',
              },
            },
          ],
        },
        {
          name: 'pointlayer',
          title: {
            cn: '点图层',
            en: 'PointLayer',
          },
          examples: [
            {
              name: 'add-remove',
              title: {
                cn: '添加和移除图层',
                en: 'Add and remove layer',
              },
            },
            {
              name: 'show-hide',
              title: {
                cn: '隐藏显示图层',
                en: 'Show and hide layer',
              },
            },
            {
              name: 'max-min-zoom',
              title: {
                cn: '图层最小和最大级别',
                en: 'Min and max zoom',
              },
            },
            {
              name: 'add-marker',
              title: {
                cn: '添加Marker',
                en: 'Add Marker',
              },
            },
            {
              name: 'add-multi-point',
              title: {
                cn: '添加MultiPoint',
                en: 'Add MultiPoint',
              },
            },
            {
              name: 'batch-add',
              title: {
                cn: '批量添加图形',
                en: 'Batch add',
              },
            },
            {
              name: 'get-by-id',
              title: {
                cn: '通过ID获取图形',
                en: 'Get geometry by id',
              },
            },
            {
              name: 'filter-by-property',
              title: {
                cn: '根据属性条件筛选图形',
                en: 'Filter data by property',
              },
            },
            {
              name: 'get-extent',
              title: {
                cn: '获取所有图形的Extent',
                en: 'Get Extent',
              },
            },
            {
              name: 'disable-events',
              title: {
                cn: '禁用图形事件',
                en: 'Disable geometry events',
              },
            },
            {
              name: 'hit-detect',
              title: {
                cn: '禁用鼠标样式检测',
                en: 'Disable hit detect',
              },
            },
            {
              name: 'set-style',
              title: {
                cn: '设置图层style',
                en: 'Set layer style',
              },
            },
            {
              name: 'style-scale',
              title: {
                cn: '图层数据整体放大',
                en: 'Style scale',
              },
            },
            {
              name: 'image-marker',
              title: {
                cn: '图片标注',
                en: 'Image marker',
              },
            },
            {
              name: 'multi-image-marker',
              title: {
                cn: '多图片标注',
                en: 'Multi image marker',
              },
            },
            {
              name: 'vector-marker',
              title: {
                cn: '矢量标注',
                en: 'Vector marker',
              },
            },
            {
              name: 'vector-gradient',
              title: {
                cn: '矢量标注渐变填充',
                en: 'Vector Gradient marker',
              },
            },
            {
              name: 'svg-marker',
              title: {
                cn: 'SVG矢量标注',
                en: 'SVG vector marker',
              },
            },
            {
              name: 'middle-alignment',
              title: {
                cn: '标注水平和垂直对齐',
                en: 'Marker middle alignment',
              },
            },
            {
              name: 'rotation-pitch-alignment',
              title: {
                cn: '旋转对齐与倾斜对齐',
                en: 'Rotation and pitch alignment',
              },
            },
            {
              name: 'rotate-marker',
              title: {
                cn: '旋转标注',
                en: 'Rotate marker',
              },
            },
            {
              name: 'rotate-text',
              title: {
                cn: '旋转文字标注',
                en: 'Rotate text',
              },
            },
            {
              name: 'image-text-marker',
              title: {
                cn: '带文字的图片标注',
                en: 'Image marker with texts',
              },
            },
            {
              name: 'text-fit',
              title: {
                cn: '图标尺寸自动适应文字',
                en: 'Marker text fit',
              },
            },
            {
              name: 'composite-symbol',
              title: {
                cn: '组合样式',
                en: 'Composite symbol',
              },
            },
            {
              name: 'update-symbol',
              title: {
                cn: '样式的部分更新',
                en: 'Update symbol',
              },
            },
            {
              name: 'symbol-by-zoom',
              title: {
                cn: '根据zoom设置样式',
                en: 'Symbol by map zoom',
              },
            },
            {
              name: 'symbol-by-prop',
              title: {
                cn: '根据属性数据设置样式',
                en: 'Symbol by geometry properties',
              },
            },
            {
              name: 'mass-data',
              title: {
                cn: '海量点标注性能',
                en: 'Mass markers',
              },
            },
            {
              name: 'mouse-identify',
              title: {
                cn: '鼠标点选数据',
                en: 'Identify markers by mouse click',
              },
            },
            {
              name: 'mouse-highlight',
              title: {
                cn: '鼠标悬停高亮数据',
                en: 'Highlight a marker by mouseover',
              },
            },
            {
              name: 'marker-events',
              title: {
                cn: '监听Marker事件',
                en: 'Listen marker events',
              },
            },
            {
              name: 'collision',
              title: {
                cn: '碰撞检测',
                en: 'Collision',
              },
            },
            {
              name: 'highlight',
              title: {
                cn: '数据高亮',
                en: 'Highlight data',
              },
            },
            {
              name: 'geometry-json',
              title: {
                cn: '数据JSON序列化',
                en: 'Geometries to JSON',
              },
            },
            {
              name: 'layer-json',
              title: {
                cn: '图层JSON序列化',
                en: 'Layer to JSON',
              },
            },
            {
              name: 'geometry-geojson',
              title: {
                cn: 'Marker转成GeoJSON',
                en: 'Marker to GeoJSON',
              },
            },
            {
              name: 'geojson-marker',
              title: {
                cn: 'GeoJSON转成Marker',
                en: 'GeoJSON to Marker',
              },
            },
          ],
        },
        {
          name: 'linelayer',
          title: {
            cn: '线图层',
            en: 'LineLayer',
          },
          examples: [
            {
              name: 'add-line',
              title: {
                cn: '添加线',
                en: 'Add a line',
              },
            },
            {
              name: 'add-multi-line',
              title: {
                cn: '添加MultiLineString',
                en: 'Add multiple lines',
              },
            },
            {
              name: 'line-style',
              title: {
                cn: '线的基础样式',
                en: 'Line basic style',
              },
            },
            {
              name: 'dash-style',
              title: {
                cn: '线的虚线样式',
                en: 'Dash line style',
              },
            },
            {
              name: 'outline-style',
              title: {
                cn: '有描边的线',
                en: 'Outline style',
              },
            },
            {
              name: 'pattern-file',
              title: {
                cn: '线的填充模式',
                en: 'Line pattern fill',
              },
            },
            {
              name: 'pattern-gap',
              title: {
                cn: '有间隔的模式填充',
                en: 'Line pattern gap',
              },
            },
            {
              name: 'pattern-animation',
              title: {
                cn: '线的模式填充动画',
                en: 'Animation of line pattern fill',
              },
            },
            {
              name: 'update-symbol',
              title: {
                cn: '线样式部分更新',
                en: 'Update symbol',
              },
            },
            {
              name: 'set-style',
              title: {
                cn: '设置图层style',
                en: 'Set layer style',
              },
            },
            {
              name: 'bind-event',
              title: {
                cn: '监听LineString事件',
                en: 'Bind event',
              },
            },
            {
              name: 'highlight',
              title: {
                cn: '数据高亮',
                en: 'Highlight data',
              },
            },
            {
              name: 'data-json',
              title: {
                cn: '数据JSON序列化',
                en: 'Data to JSON',
              },
            },
            {
              name: 'layer-json',
              title: {
                cn: '图层JSON序列化',
                en: 'Layer to JSON',
              },
            },
            {
              name: 'line-geojson',
              title: {
                cn: 'LineString转成GeoJSON',
                en: 'LineString to GeoJSON',
              },
            },
            {
              name: 'geojson-line',
              title: {
                cn: 'GeoJSON转成LineString',
                en: 'GeoJSON to LineString',
              },
            },
          ],
        },
        {
          name: 'polygonlayer',
          title: {
            cn: '面图层',
            en: 'PolygonLayer',
          },
          examples: [
            {
              name: 'add-polygon',
              title: {
                cn: '添加面',
                en: 'Add a polygon',
              },
            },
            {
              name: 'add-multi-polygon',
              title: {
                cn: '添加MultiPolygon',
                en: 'Add MultiPolygon',
              },
            },
            {
              name: 'basic-style',
              title: {
                cn: '面的基本样式',
                en: 'Polygon basic style',
              },
            },
            {
              name: 'pattern-file',
              title: {
                cn: '面的填充模式',
                en: 'Polygon pattern file',
              },
            },
            {
              name: 'vertex-marker',
              title: {
                cn: '面的端点样式',
                en: 'Polygon vertex style',
              },
            },
            {
              name: 'alignment',
              title: {
                cn: '面的内部样式',
                en: 'Polygon alignment style',
              },
            },
            {
              name: 'update-symbol',
              title: {
                cn: '面样式部分更新',
                en: 'Update symbol',
              },
            },
            {
              name: 'set-style',
              title: {
                cn: '设置图层style',
                en: 'Set layer style',
              },
            },
            {
              name: 'highlight',
              title: {
                cn: '数据高亮',
                en: 'Highlight data',
              },
            },
            {
              name: 'geometry-json',
              title: {
                cn: '数据JSON序列化',
                en: 'Geometry to JSON',
              },
            },
            {
              name: 'layer-json',
              title: {
                cn: '图层JSON序列化',
                en: 'Layer to JSON',
              },
            },
            {
              name: 'geometry-geojson',
              title: {
                cn: 'Polygon转成GeoJSON',
                en: 'Polygon to GeoJSON',
              },
            },
            {
              name: 'geojson-geometry',
              title: {
                cn: 'GeoJSON转成Polygon',
                en: 'GeoJSON to Polygon',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'gltf',
      title: {
        cn: 'GLTF模型',
        en: 'GLTF',
      },
      examples: [
        {
          name: 'gltf-marker',
          title: {
            cn: 'GLTFMarker',
            en: 'GLTFMarker',
          },
          examples: [
            {
              name: 'add-marker',
              title: {
                cn: '添加GLTFMarker',
                en: 'Add a GLTF Marker',
              },
            },
            {
              name: 'copy-marker',
              title: {
                cn: '复制GLTFMarker',
                en: 'Copy a GLTF Marker',
              },
            },
            {
              name: 'animation-model',
              title: {
                cn: '动画模型',
                en: 'Animation model',
              },
            },
            {
              name: 'show-hide',
              title: {
                cn: '模型的显示与隐藏',
                en: 'Show and hide model',
              },
            },
            {
              name: 'trs',
              title: {
                cn: '模型的平移，旋转与缩放',
                en: 'Translation, rotate and scale',
              },
            },
            {
              name: 'material',
              title: {
                cn: '模型材质调节',
                en: 'Set material',
              },
            },
            {
              name: 'shader',
              title: {
                cn: '着色器切换',
                en: 'Change shader',
              },
            },
            {
              name: 'update-symbol',
              title: {
                cn: '模型的symbol设置',
                en: 'Update symbol',
              },
            },
            {
              name: 'info-window',
              title: {
                cn: '设置信息弹出框',
                en: 'Info window',
              },
            },
            {
              name: 'mouse-event',
              title: {
                cn: '鼠标事件监听',
                en: 'Mouse event',
              },
            },
            {
              name: 'outline',
              title: {
                cn: '模型设置外轮廓',
                en: 'Outline',
              },
            },
            {
              name: 'bloom',
              title: {
                cn: '模型泛光效果',
                en: 'Bloom',
              },
            },
            {
              name: 'shadow',
              title: {
                cn: '阴影设置',
                en: 'Shadow',
              },
            },
            {
              name: 'skinning',
              title: {
                cn: '加载有骨骼动画的模型',
                en: 'Skeletal animation model',
              },
            },
            {
              name: 'context-menu',
              title: {
                cn: '右键菜单',
                en: 'Context menu',
              },
            },
            {
              name: 'anchor',
              title: {
                cn: '锚点的设置',
                en: 'Anchor Z',
              },
            },
            {
              name: 'fix-size',
              title: {
                cn: '固定模型的大小不随地图缩放',
                en: 'Fix Size',
              },
            },
            {
              name: 'model-matrix',
              title: {
                cn: '更新模型的ModelMatrix',
                en: 'Update ModelMatrix',
              },
            },
            {
              name: 'time-frame',
              title: {
                cn: 'setAnimationTimeFrame',
                en: 'Set animation time frame',
              },
            },
            {
              name: 'property',
              title: {
                cn: '设置/获取属性',
                en: 'Set and get property',
              },
            },
            {
              name: 'draco',
              title: {
                cn: '添加draco压缩模型',
                en: 'Add draco',
              },
            },
            {
              name: 'set-altitude',
              title: {
                cn: 'GLTFMarker设置海拔高度',
                en: 'Set altitude',
              },
            },
            {
              name: 'gltf-modelHeight',
              title: {
                cn: '设置模型高度',
                en: 'Set height',
              },
            },
          ],
        },
        {
          name: 'gltf-layer',
          title: {
            cn: 'GLTFLayer',
            en: 'GLTFLayer',
          },
          examples: [
            {
              name: 'add-to-map',
              title: {
                cn: '添加图层到地图上',
                en: 'Add layer to map',
              },
            },
            {
              name: 'search-by-id',
              title: {
                cn: '根据id查找GLTFMarker',
                en: 'Search marker by id',
              },
            },
            {
              name: 'remove-marker',
              title: {
                cn: '移除某个GLTFMarker',
                en: 'Remove GLTFMarker',
              },
            },
            {
              name: 'clear',
              title: {
                cn: '清空图层',
                en: 'Clear layer',
              },
            },
            {
              name: 'show-hide',
              title: {
                cn: '图层的显示与隐藏',
                en: 'Show and hide layer',
              },
            },
            {
              name: 'create-by-json',
              title: {
                cn: '通过json数据创建图层',
                en: 'Create layer by json',
              },
            },
            {
              name: 'set-style',
              title: {
                cn: '为图层设置样式条件',
                en: 'Set layer style',
              },
            },
            {
              name: 'identify',
              title: {
                cn: '识别图层内的GLTFMarker',
                en: 'Identify marker',
              },
            },
            {
              name: 'custom-shader',
              title: {
                cn: '自定义着色器',
                en: 'Custom shader',
              },
            },
            {
              name: 'blended-drawing',
              title: {
                cn: '多个GLTFLayer的融合绘制',
                en: 'Fusion rendering of multiple layers',
              },
            },
            {
              name: 'filter-by-property',
              title: {
                cn: '根据属性条件筛选',
                en: 'Filter data by property',
              },
            },
            {
              name: 'load-event',
              title: {
                cn: '模型载入完成事件',
                en: 'Data load event',
              },
            },
          ],
        },
        {
          name: 'multi-gltf-marker',
          title: {
            cn: 'MultiGLTFMarker',
            en: 'MultiGLTFMarker',
          },
          examples: [
            {
              name: 'add',
              title: {
                cn: '添加MultiGLTFMarker',
                en: 'Add MultiGLTFMarker',
              },
            },
            {
              name: 'add-data',
              title: {
                cn: '增加一个数据项',
                en: 'Add data',
              },
            },
            {
              name: 'remove-data',
              title: {
                cn: '移除一个数据项',
                en: 'Remove data',
              },
            },
            {
              name: 'update-data',
              title: {
                cn: '更新一个数据项',
                en: 'Update data',
              },
            },
            {
              name: 'mouse-event',
              title: {
                cn: '监听鼠标事件',
                en: 'Listening for mouse events',
              },
            },
          ],
        },
        {
          name: 'gltf-linestring',
          title: {
            cn: 'GLTFLineString',
            en: 'GLTFLineString',
          },
          examples: [
            {
              name: 'add',
              title: {
                cn: '添加GLTFLineString',
                en: 'Add GLTFLineString',
              },
            },
            {
              name: 'draw',
              title: {
                cn: '绘制模型场景',
                en: 'Draw Model Scene',
              },
            },
          ],
        },
        {
          name: 'transform-control',
          title: {
            cn: 'TransformControl',
            en: 'TransformControl',
          },
          examples: [
            {
              name: 'trs',
              title: {
                cn: '控制模型的平移、旋转、缩放',
                en: 'Control the translation, rotation, and scaling of the model',
              },
            },
          ],
        },
      ],
    },
    {
      name: '3d',
      title: {
        cn: '三维功能',
        en: '3D',
      },
      examples: [
        {
          name: 'line-3d-style',
          title: {
            cn: '线数据三维样式',
            en: 'Line data 3d Style',
          },
          examples: [
            {
              name: 'texture',
              title: {
                cn: '设置纹理',
                en: 'Set textures',
              },
            },
            {
              name: 'altitude',
              title: {
                cn: '数据里包含海拔值',
                en: 'geojson has altitude',
              },
            },
          ],
        },
        {
          name: 'polygon-3d-style',
          title: {
            cn: '三维白模样式',
            en: 'Polygon data 3d Style',
          },
          examples: [
            {
              name: 'set-height',
              title: {
                cn: '设置高度',
                en: 'Set height',
              },
            },
            {
              name: 'diffrent-textures',
              title: {
                cn: '顶面和侧面设置不同的纹理',
                en: 'Set different textures on the top and side',
              },
            },
            {
              name: 'top-side-color',
              title: {
                cn: '垂直颜色渐变',
                en: 'Vertical color gradient',
              },
            },
            {
              name: 'side-uv-mode',
              title: {
                cn: '设置侧面纹理模式',
                en: 'Set side vertical uv mode',
              },
            },
            {
              name: 'entry',
              title: {
                cn: '进场动画',
                en: 'Entry animation',
              },
            },
          ],
        },
        {
          name: 'waterstyle',
          title: {
            cn: '水体渲染',
            en: 'Water style',
          },
          examples: [
            {
              name: 'reflection',
              title: {
                cn: '水体渲染，倒影及水面文字',
                en: 'Water style, reflection and text',
              },
            },
          ],
        },
        {
          name: 'terrain',
          title: {
            cn: '地形',
            en: 'Terrain',
          },
          examples: [
            {
              name: 'load',
              title: {
                cn: '加载地形',
                en: 'Load terrain',
              },
            },
            {
              name: 'stylized',
              title: {
                cn: '风格化地形',
                en: 'Stylized terrain',
              },
            },
            {
              name: 'vector',
              title: {
                cn: '矢量贴地形',
                en: 'Vector terrain',
              },
            },
          ],
        },
        {
          name: 'traffic',
          title: {
            cn: '交通',
            en: 'Traffic',
          },
          examples: [
            {
              name: 'simulated-traffic',
              title: {
                cn: '模拟交通',
                en: 'Simulated traffic',
              },
            },
          ],
        },
        {
          name: '3dtiles',
          title: {
            cn: '3dtiles功能示例',
            en: '3D Tiles',
          },
          examples: [
            {
              name: 'load',
              title: {
                cn: '加载倾斜摄影数据',
                en: 'Load data',
              },
            },
            {
              name: 'view',
              title: {
                cn: '跳转视角',
                en: 'Jump view',
              },
            },
            {
              name: 'rotate',
              title: {
                cn: '旋转地图',
                en: 'Rotating map',
              },
            },
            {
              name: 'manually-icon',
              title: {
                cn: '手动添加图标',
                en: 'Manually adding icon',
              },
            },
            {
              name: 'point-icon',
              title: {
                cn: '定点添加图标',
                en: 'Point add icon',
              },
            },
            {
              name: 'model-entity',
              title: {
                cn: '模型单体化',
                en: 'Model entity',
              },
            },
            {
              name: 'room-entity',
              title: {
                cn: '模型房间单体化',
                en: 'Model room entity',
              },
            },
            {
              name: 'floor-entity',
              title: {
                cn: '模型楼层单体化',
                en: 'Model floor entity',
              },
            },
            {
              name: 'custom-monomer',
              title: {
                cn: '自定义单体化的绘制',
                en: 'Custom monomer',
              },
            },
            {
              name: 'drawer-entity',
              title: {
                cn: '单体化抽屉效果',
                en: 'Entity drawer effect',
              },
            },
            {
              name: 'view-monomer',
              title: {
                cn: '查看单体化',
                en: 'view monomer',
              },
            },
            {
              name: 'model-flatten',
              title: {
                cn: '模型压平',
                en: 'model flatten',
              },
            },
          ],
        },
        {
          name: 'pipeline',
          title: {
            cn: '管线',
            en: 'Pipeline',
          },
          examples: [
            {
              name: 'underground',
              title: {
                cn: '地下管线',
                en: 'Underground pipelines',
              },
            },
            {
              name: 'flow',
              title: {
                cn: '管线流动效果',
                en: 'Pipeline flow effect',
              },
            },
            {
              name: 'connections',
              title: {
                cn: '自动生成三通和四通',
                en: 'Generate three-way and four-way connections',
              },
            },
          ],
        },
        {
          name: 'spatial-analysis',
          title: {
            cn: '空间分析',
            en: 'Spatial analysis',
          },
          examples: [
            {
              name: 'measure',
              title: {
                cn: '空间测量',
                en: 'Spatial measure',
              },
            },
            {
              name: 'skyline',
              title: {
                cn: '天际线分析',
                en: 'Skyline Analysis',
              },
            },
            {
              name: 'insight',
              title: {
                cn: '通视分析',
                en: 'InSight Analysis',
              },
            },
            {
              name: 'viewshed',
              title: {
                cn: '可视域分析',
                en: 'ViewShed Analysis',
              },
            },
            {
              name: 'flood',
              title: {
                cn: '水淹分析',
                en: 'Flood Analysis',
              },
            },
            {
              name: 'cut',
              title: {
                cn: '平面裁剪',
                en: 'Cut Analysis',
              },
            },
            {
              name: 'excavate',
              title: {
                cn: '挖方分析',
                en: 'Excavate analysis',
              },
            },
            {
              name: 'crosscut',
              title: {
                cn: '剖面分析',
                en: 'Crosscut analysis',
              },
            },
            {
              name: 'height-limit',
              title: {
                cn: '限高分析',
                en: 'Height limit analysis',
              },
            },
            {
              name: 'box-clip',
              title: {
                cn: '盒子裁剪',
                en: 'box clip',
              },
            },
            {
              name: 'raycaster',
              title: {
                cn: '光线投射',
                en: 'Raycaster',
              },
            },
          ],
        },
        {
          name: 'track',
          title: {
            cn: '轨迹路线',
            en: 'Trajectory route',
          },
          examples: [
            {
              name: 'flying-driving',
              title: {
                cn: '沿轨迹飞行与地面行驶',
                en: 'Flying along trajectories and driving on the ground',
              },
            },
            {
              name: 'ground-route',
              title: {
                cn: '沿地面轨迹飞行',
                en: 'Flying along ground trajectory',
              },
            },
            {
              name: 'unmanned',
              title: {
                cn: '无人机飞行轨迹',
                en: 'Drone flight trajectory',
              },
            },
            {
              name: 'around-point',
              title: {
                cn: '绕点环绕飞行',
                en: 'Orbiting around a point',
              },
            },
            {
              name: 'auto-roaming',
              title: {
                cn: '自动漫游',
                en: 'Auto roaming',
              },
            },
            {
              name: 'free-roaming',
              title: {
                cn: '自由漫游',
                en: 'Free roaming',
              },
            },
            {
              name: 'personnel-position',
              title: {
                cn: '人员实时定位',
                en: 'Real time personnel positioning',
              },
            },
            {
              name: 'device-position',
              title: {
                cn: '设备实时定位',
                en: 'Real time device positioning',
              },
            },
          ],
        },
        {
          name: 'video',
          title: {
            cn: '视频图层',
            en: 'Video layer',
          },
          examples: [
            {
              name: 'add',
              title: {
                cn: '添加视频对象',
                en: 'Add video',
              },
            },
          ],
        },
        {
          name: 'weather',
          title: {
            cn: '天气系统',
            en: 'Weather',
          },
          examples: [
            {
              name: 'fog',
              title: {
                cn: '雾',
                en: 'Fog',
              },
            },
            {
              name: 'rain',
              title: {
                cn: '雨',
                en: 'Rain',
              },
            },
            {
              name: 'snow',
              title: {
                cn: '雪',
                en: 'Snow',
              },
            },
            {
              name: 'sunny',
              title: {
                cn: '晴天',
                en: 'Sunny',
              },
            },
          ],
        },
      ],
    },
  ];
}

export const THUMBNAIL_URL = 'http://examples.maptalks.com/thumbnails/';
