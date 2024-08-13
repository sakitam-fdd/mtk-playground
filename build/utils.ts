import { resolve } from 'node:path';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 获取用户的根目录
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}

export const pathResolve = (pathStr: string): string => resolve(getRootPath(), '.', pathStr);

// 读取所有的环境变量
export function wrapperEnv(envConf: Recordable): ImportMetaEnv {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    } else if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
        console.error(error);
      }
    }
    ret[envName] = realName;
  }
  return ret;
}

/**
 * 解析路径
 * @param rootPath
 * @param basePath - 基础路径
 */
export function resolvePath(rootPath: string, basePath: string) {
  const root = fileURLToPath(new URL(rootPath, basePath));
  const src = `${root}src`;

  return {
    root,
    src,
  };
}

const httpsRE = /^https:\/\//;

/**
 * 创建代理配置
 * @param list 代理列表
 * @returns
 */
export function createProxy(list: any = []) {
  const ret: any = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);

    ret[`^${prefix}`] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (p) => p.replace(new RegExp(`^${prefix}`), prefix),
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
