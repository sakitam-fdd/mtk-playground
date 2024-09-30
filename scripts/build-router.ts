import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import { prettierRules } from '@aurorafe/eslint-config-base/rules';

import { pathResolve } from '../build/utils';

const prettierOptions = {
  parser: 'babel',
  ...prettierRules,
};

const output = pathResolve('src/router/pls.ts');
const sourceDir = pathResolve('./.playgrounds');

function downloadPls() {}

function processRoutes(routes: any[]): string {
  return JSON.stringify(routes, null, 2).replace(/"component": "(.*?)"/g, '"component": () => import("$1")');
  // .replace(/"children": \[/g, '"children": processRoutes(')
  // .replace(/\]\s+\}/g, '])');
}

async function buildRouter() {
  function traverseDirectory(dir, baseRoute: string = '') {
    const routes: any[] = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    // 首先检查是否存在 src/App.vue
    const srcDir = files.find((entry) => entry.isDirectory() && entry.name === 'src');
    if (srcDir) {
      const srcAppPath = path.join(dir, 'src', 'App.vue');
      if (fs.existsSync(srcAppPath)) {
        const relativePath = path.relative(sourceDir, dir);
        return [
          {
            path: '',
            isLeaf: true,
            component: `~/.playgrounds/${relativePath}/src/App.vue`,
          },
        ];
      }
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file.name);
      const routePath = path.join(baseRoute, file.name);

      if (file.isDirectory()) {
        const children = traverseDirectory(fullPath, routePath);
        if (children.length > 0) {
          const isLeaf = children.every((child) => child.isLeaf);
          if (isLeaf) {
            routes.push({
              path: file.name,
              name: routePath.replace(/\//g, '_'),
              component: children[0].component,
            });
          } else {
            routes.push({
              path: file.name,
              name: routePath.replace(/\//g, '_'),
              children,
            });
          }
        }
      }
    });

    return routes;
  }

  const routes = traverseDirectory(sourceDir);

  const string = await prettier.format(processRoutes(routes), prettierOptions);

  const routesContent = `import { RouteRecordRaw } from 'vue-router';

export const playgroundRoutes: RouteRecordRaw[] = ${string}`;

  fs.writeFileSync(output, routesContent);
}

buildRouter();
