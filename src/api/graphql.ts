import { Octokit } from 'octokit';
import { get, assign } from 'lodash-es';
import dayjs from 'dayjs';
import { to } from '@/utils/to';
import { useAppStoreHook } from '@/store/modules';
import { ElNotification } from 'element-plus';
import { ascending } from '@/utils/utils';
import { t } from '@/plugins/locales';
import { playgroundRoutes } from '@/router/pls';

export function getGithubToken() {
  return localStorage.getItem('GITHUB_AUTH_TOKEN') || import.meta.env.VITE_AUTH_TOKEN;
}

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: getGithubToken(),
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

/**
 * 判断请求是否成功 (用在 Rest接口)
 * @param res
 * @returns
 */
export function isSuccess(res: Record<string, any>) {
  return [201, 200].includes(res.status);
}

/**
 * 生成临时分支
 * @returns String
 */
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

/**
 * 匹配文件 sha
 * @param currentEditorFiles
 * @param files
 * @returns
 */
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
  { branch, folder, repositoryId },
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
      repositoryId,
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
            title: t('app.messages.error'),
            message: t('app.messages.updateRefError'),
            type: 'error',
          });
        } else {
          ElNotification({
            title: t('app.messages.error'),
            message: t('app.messages.createCommitError'),
            type: 'error',
          });
        }
      } else {
        ElNotification({
          title: t('app.messages.error'),
          message: t('app.messages.createFileTreeError'),
          type: 'error',
        });
      }
    } else {
      ElNotification({
        title: t('app.messages.error'),
        message: t('app.messages.getLatestCommitError'),
        type: 'error',
      });
    }
  } else {
    ElNotification({
      title: t('app.messages.error'),
      message: t('app.messages.pleaseTryAgainLater'),
      type: 'error',
    });
  }
}

/**
 * 获取仓库的文件目录树
 */
export async function getFileTree(sha = 'main', depth = 0, path = '') {
  if (depth > 2) return [];

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

        const p = appStore.playgroundTypes.find((pl) => pl.id === item.name);

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
              title: t('app.messages.error'),
              message: t('app.messages.updateRefError'),
              type: 'error',
            });
          }
        } else {
          ElNotification({
            title: t('app.messages.error'),
            message: t('app.messages.createCommitError'),
            type: 'error',
          });
        }
      } else {
        ElNotification({
          title: t('app.messages.error'),
          message: t('app.messages.createFileTreeError'),
          type: 'error',
        });
      }
    } else {
      ElNotification({
        title: t('app.messages.error'),
        message: t('app.messages.getLatestCommitError'),
        type: 'error',
      });
    }
  } else {
    ElNotification({
      title: t('app.messages.error'),
      message: t('app.messages.createBranchError'),
      type: 'error',
    });
  }
}

export async function updateFolder(body) {
  console.log(body);
}

/**
 * 上传资源到 GitHub 仓库
 * tip: 静态资源是否需要审核，目前来说我们上传完需要立即使用审核的话会割裂这一流程
 * @param userConfigInfo
 * @param files
 */
export async function uploadResources(userConfigInfo: any, files: any[]): Promise<boolean> {
  const { branch, selectedDir } = userConfigInfo;

  const blobs = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    file.uploadStatus.uploading = true;
    const blobRes = await getFileBlob(file, owner, repo);
    if (blobRes) {
      blobs.push({ file, ...blobRes });
    } else {
      file.uploadStatus.uploading = false;
    }
  }

  const [error, res] = await to(getBranch());

  if (!error && res) {
    const finalPath = selectedDir === '/' ? '' : `${selectedDir}/`;

    // 创建 tree
    const treeRes = await createTree(
      owner,
      repo,
      blobs.map((x: any) => ({
        sha: x.sha,
        path: `${finalPath}${x.img.filename.final}`,
      })),
      branchRes,
    );
    if (!treeRes) {
      return Promise.resolve(false);
    }

    // 创建 commit 节点
    const commitRes: any = await createCommit(owner, repo, treeRes, branchRes);
    if (!commitRes) {
      return Promise.resolve(false);
    }

    // 将当前分支 ref 指向新创建的 commit
    const refRes = await createRef(owner, repo, branch, commitRes.sha);
    if (!refRes) {
      return Promise.resolve(false);
    }

    blobs.forEach((blob: any) => {
      // todo
    });
  }

  return Promise.resolve(true);
}

/**
 * 获取所有 playground 列表
 * http://examples.maptalks.com/thumbnails/basic_ui-control_infowindow-scroll.webp
 * @returns
 */
export async function getPlaygroundList() {
  return playgroundRoutes;
}

const baseDir = import.meta.env.VITE_BASE_DIR;
// 注意这里缩略图，不同平台获取的路径并不相同
export const THUMBNAIL_URL = `${window.location.protocol}//${window.location.host}${baseDir ? baseDir : '/'}thumbnails/`;
