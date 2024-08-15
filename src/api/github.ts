import { Octokit } from 'octokit';
import { get, assign } from 'lodash-es';
import dayjs from 'dayjs';
import { to } from '@/utils/to';
import { playgroundTypes } from '@/api/common';

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: '',
});

const owner = 'aurorafe';
const repo = 'coderun';
const commonHeaders = {
  'X-GitHub-Api-Version': '2022-11-28',
};
const baseBranch = 'main';

const commonAuthor = {
  name: 'sakitam-fdd',
  email: '',
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

/**
 * 创建新文件
 * @param files
 * @param branch
 * @param folder
 */
export async function createFile(files: Record<string, string>, { branch, folder }) {
  const keys = Object.keys(files);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: folder ? `${folder}/${key}` : key,
      message: 'docs: add file',
      committer: commonAuthor,
      author: commonAuthor,
      content: btoa(files[key]),
      branch,
      headers: {
        ...commonHeaders,
      },
    });
  }

  await to(
    createPR({
      branch,
      title: `feature: add ${folder} playground`,
      body: `add ${folder} playground`,
    }),
  );
}

export async function updateFile() {}

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
