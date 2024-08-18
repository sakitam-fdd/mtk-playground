import { saveAs } from 'file-saver';
import type { ReplStore } from '@vue/repl';
import index from './template/index.html?raw';
import main from './template/main.js?raw';
import pkg from './template/package.json?raw';
import config from './template/vite.config.js?raw';
import readme from './template/README.md?raw';

export async function downloadProject(store: ReplStore) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  // basic structure
  zip.file('index.html', index);
  zip.file('package.json', pkg);
  zip.file('vite.config.js', config);
  zip.file('README.md', readme);

  // project src
  const src = zip.folder('src')!;
  src.file('main.js', main);

  const files = store.getFiles();
  // eslint-disable-next-line no-restricted-syntax
  for (const file in files) {
    if (file !== 'import-map.json' && file !== 'tsconfig.json') {
      src.file(file, files[file]);
    } else {
      zip.file(file, files[file]);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'maptalks-project.zip');
}

export function buildCommit(store: ReplStore, isEdit = false) {
  const object = isEdit
    ? []
    : [
        {
          name: 'package.json',
          path: 'package.json',
          content: pkg,
        },
        {
          name: 'vite.config.js',
          path: 'vite.config.js',
          content: config,
        },
        {
          name: 'README.md',
          path: 'README.md',
          content: readme,
        },
        {
          name: 'index.html',
          path: 'index.html',
          content: index,
        },
      ];

  const files = store.getFiles();
  // eslint-disable-next-line no-restricted-syntax
  for (const file in files) {
    if (file !== 'import-map.json' && file !== 'tsconfig.json') {
      object.push({
        name: file,
        path: `src/${file}`,
        content: files[file],
      });
    } else {
      object.push({
        name: file,
        path: file,
        content: files[file],
      });
    }
  }

  return object;
}
