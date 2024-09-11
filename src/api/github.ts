import { Octokit } from 'octokit';
import { get, assign } from 'lodash-es';
import dayjs from 'dayjs';
import { to } from '@/utils/to';
import { playgroundTypes } from '@/api/common';

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

export async function getBranch() {
  return await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
    owner,
    repo,
    branch: baseBranch,
    headers: {
      ...commonHeaders,
    },
  });
}

export async function createBranch({ branchName }: { branchName: string }) {
  const [error, res] = await to(getBranch());

  if (!error && isSuccess(res)) {
    return await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: get(res, 'data.commit.sha', ''),
      headers: {
        ...commonHeaders,
      },
    });
  }
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

/**
 * 获取仓库的文件目录树
 */
export async function getFileTree(sha = 'main', depth = 0, path = '') {
  if (depth > 2) return [];

  const [error, res] = await to(
    octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
      owner,
      repo,
      tree_sha: sha,
      headers: {
        ...commonHeaders,
      },
    }),
  );

  if (!error && isSuccess(res)) {
    const data = get(res, 'data.tree', []).filter((item) => item.type === 'tree');

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      item.fullPath = path ? `${path}/${item.path}` : item.path;
      const p = playgroundTypes.find((pl) => pl.label === item.path);

      if (p) {
        assign(item, p);
      } else {
        assign(item, {
          collapse: true,
        });
      }

      const [e, r] = await to(getFileTree(item.sha, depth + 1, item.fullPath));

      if (!e && r) {
        item.children = r && r?.length ? r : null;
      }
    }

    return data;
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

/**
 * 在 github 创建 pr
 * todo: 需要判断是否有文件变更
 * @param branch
 * @param title
 * @param body
 */
export async function createPR({ branch, title, body }: { branch: string; title: string; body: string }) {
  await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    title,
    body,
    head: branch,
    base: baseBranch,
    headers: {
      ...commonHeaders,
    },
  });
}

export async function createFolder(body: { name: string; playgroundType: string }) {
  const branch = buildBranch();

  const [error, data] = await to(createBranch({ branchName: branch }));

  if (!error && isSuccess(data)) {
    const [e, res] = await to(
      octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: `${body.playgroundType}/${body.name}/.gitkeep`,
        message: 'docs: add folder',
        committer: commonAuthor,
        author: commonAuthor,
        content: btoa(``),
        branch,
        headers: {
          ...commonHeaders,
        },
      }),
    );

    if (!e && isSuccess(res)) {
      await to(
        createPR({
          branch,
          title: `update: add folder ${body.playgroundType}/${body.name}`,
          body: `add folder ${body.playgroundType}/${body.name}`,
        }),
      );
    }
  } else {
    console.log(error);
  }
}

export async function updateFolder(body) {
  console.log(body);
}
