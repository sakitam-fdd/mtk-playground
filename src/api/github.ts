import { Octokit } from 'octokit';
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import { to } from '@/utils/to';

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

function isSuccess(res: Record<string, any>) {
  return [201, 200].includes(res.code);
}

export function buildBranch() {
  return `feature/docs-demo-${dayjs().format('YYYY-MM-DD HH:mm')}`;
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
 */
export async function createFile(files: Record<string, string>, { branch }) {
  const keys = Object.keys(files);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: key,
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
}

export async function updateFile() {}

/**
 * 获取仓库的文件目录树
 */
export async function getFileTree() {
  const res = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
    owner,
    repo,
    tree_sha: 'main',
    headers: {
      ...commonHeaders,
    },
  });

  console.log(res);

  return res;
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

export async function createPR() {
  await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    title: 'Amazing new feature',
    body: 'Please pull these awesome changes in!',
    head: 'octocat:new-feature',
    base: baseBranch,
    headers: {
      ...commonHeaders,
    },
  });
}

export async function createFolder() {

}

export async function updateFolder() {

}
