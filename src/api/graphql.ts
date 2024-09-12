import { Octokit } from 'octokit';
import { get, assign } from 'lodash-es';
import dayjs from 'dayjs';
import { to } from '@/utils/to';
import { useAppStoreHook } from '@/store/modules';
import { date } from '../utils/dayjs';

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
  for (let i = 0; i < currentEditorFiles.length; i++) {
    const f = currentEditorFiles[i];

    for (let j = 0; j < files.length; j++) {
      const file = files[j];

      if (f.name === file.name) {
        file.sha = f.sha;
        break;
      }
    }
  }
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

export async function commitAndPr({ content, folder }) {
  // 创建新分支 ref
  const branch = buildBranch();

  const [error, data] = await to(createBranch({ branchName: branch }));

  console.log(error, data);
  const [e] = await to(
    createFile(content, {
      branch,
      folder,
    }),
  );

  console.log(e);
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

// eslint-disable-next-line @typescript-eslint/no-shadow
function generateQuery(owner: string, repo: string, path: string, depth: number): string {
  let query = `
  {
    repository(owner: "${owner}", name: "${repo}") {
      object(expression: "${path}") {
        ... on Tree {
          entries {
            name
            type
  `;

  // 添加递归部分
  for (let i = 0; i < depth - 1; i++) {
    query += `
            object {
              ... on Tree {
                entries {
                  name
                  type
      `;
  }

  // 关闭所有递归层次的括号
  for (let i = 0; i < depth - 1; i++) {
    query += `
                }
              }
            }
      `;
  }

  query += `
          }
        }
      }
    }
  }
  `;
  return query;
}

function ccPr() {
  return octokit.graphql(``, {
    he,
  });
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
    const loop = (array) => {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];

        const p = appStore.playgroundTypes.find((pl) => pl.label === item.name);

        if (p) {
          // 给枚举数据赋值上sha
          p.sha = item.sha;
          assign(item, p);
        } else {
          assign(item, {
            collapse: true,
          });
        }

        if (item.type === 'tree' && item?.object?.entries?.length > 0) {
          item.children = loop(item.object.entries).filter((it: any) => !['.gitkeep'].includes(it.name));
        } else {
          item.children = null;
        }
      }

      return array;
    };

    return loop(data);
  }

  return [];
}

// 以下文件无需拉取，这是通用公共文件
const excludeFileName = ['index.html', 'vite.config.js', 'README.md', 'main.js', 'package.json', '.gitkeep'];

export async function getPlaygroundLoop(item: any, files: any[]) {
  const [error, res] = await to(
    octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
      owner,
      repo,
      tree_sha: item?.sha,
      headers: {
        ...commonHeaders,
      },
    }),
  );

  if (!error && isSuccess(res)) {
    const data = get(res, 'data.tree', []);

    // 示例目录下的所有文件加目录
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const pathArray = d.path.split('/');
      const fileName = pathArray[pathArray.length - 1];
      // 如果还是文件夹(默认应该是 src)，那么递归
      if (d.type === 'tree') {
        await getPlaygroundLoop({ sha: d.sha, fullPath: item.fullPath ? `${item.fullPath}/${d.path}` : d.path }, files);
      } else if (!excludeFileName.includes(fileName)) {
        // 如果是文件获取文件内容
        const [e, r] = await to(getFileContent(`${item.fullPath}/${d.path}`));

        if (!e && isSuccess(r)) {
          files.push(r.data);
        }
      }
    }
  }

  return files;
}

export async function getPlayground(item: any) {
  const files = [];

  await getPlaygroundLoop(item, files);

  return files.map((f) => ({
    ...f,
    playgroundCode: atob(f.content),
    playgroundPath: f.path.replace(`${item.fullPath}/`, ''),
  }));
}

export async function getFileContent(path: string) {
  return await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path,
    headers: {
      ...commonHeaders,
    },
  });
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

export async function createCommit() {}

/**
 * 在 github 创建 pr
 * todo: 需要判断是否有文件变更
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
  await octokit.graphql(
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
}

export async function createFolder(body: { name: string; playgroundType: string; sha?: string }) {
  const branch = buildBranch();

  const [error, data] = await to(createBranch({ branchName: branch }));

  if (!error && data) {
    const d = await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/{branch}', {
      owner,
      repo,
      branch,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    console.log(d);

    const [getTreeError, getTreeRes] = await to<any>(
      octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
        owner,
        repo,
        commit_sha: d.data.object.sha,
        headers: {
          ...commonHeaders,
        },
      }),
    );

    // 创建文件🌲
    const [treeError, treeRes] = await to<any>(
      octokit.request(`POST /repos/{owner}/{repo}/git/trees`, {
        owner,
        repo,
        base_tree: getTreeRes.data.tree.sha,
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

    // await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
    //   owner,
    //   repo,
    //   tree_sha: res.data.tree[0].sha,
    //   headers: {
    //     'X-GitHub-Api-Version': '2022-11-28',
    //   },
    // });

    // 依据文件树创建commit
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

    // 更新到对应的分支
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
        // 创建pr
        await to(
          createPR({
            repositoryId: data.repositoryId,
            branch,
            title: `update: add folder ${body.playgroundType}/${body.name}`,
            body: `add folder ${body.playgroundType}/${body.name}`,
          }),
        );
      }
    }
  } else {
    console.log(error);
  }
}

export async function updateFolder(body) {
  console.log(body);
}
