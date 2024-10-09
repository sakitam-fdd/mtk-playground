// from openlayers
import { promisify } from 'util';
import fs from 'fs';
import fse from 'fs-extra';
import path, { dirname } from 'path';
import { exec } from 'child_process';
import { preview } from 'vite';
import png from 'pngjs';
import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';
import { fileURLToPath } from 'url';
import { playgroundRoutes } from '../src/router/pls';

const baseDir = dirname(fileURLToPath(import.meta.url));

async function serve(options: Record<string, any>) {
  // const __dirname = fileURLToPath(new URL('.', import.meta.url));

  if (!options.skipBuild) {
    const { stdout, stderr } = await promisify(exec)('pnpm run build', {
      cwd: path.resolve(baseDir, '../'),
    });
    console.log(stdout);
    console.error(stderr);
  }

  const previewServer = await preview({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: false,
    envFile: false,
    preview: {
      port: options.port,
      open: false,
    },
  });

  previewServer.printUrls();
  return previewServer.close;
}

function getActualScreenshotPath(entry: string) {
  return path.join(baseDir, '../public/thumbnails/actual.png');
}

function parsePNG(filepath: string) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filepath);
    stream.on('error', (err) => {
      if ((err as any).code === 'ENOENT') {
        return reject(new Error(`File not found: ${filepath}`));
      }
      reject(err);
    });

    const image = stream.pipe(new png.PNG());
    image.on('parsed', () => resolve(image));
    image.on('error', reject);
  });
}

let handleRender: ((message: any) => void) | null;
async function exposeRender(page: Page) {
  // 这里可以在页面主动暴露 render 函数调用，调用后就会触发此回调
  await page.exposeFunction('render', (message: any) => {
    if (!handleRender) {
      throw new Error('No render handler set for current page');
    }
    handleRender(message);
  });
}

async function renderPage(page: Page, entry: string, options: Record<string, any>) {
  const renderCalled = new Promise((resolve) => {
    handleRender = (config: any) => {
      handleRender = null;
      resolve(config || {});
    };
  });
  await page.goto(`http://${options.host}:${options.port}${entry}`, {
    waitUntil: 'networkidle0',
  });

  await page.evaluate(
    () =>
      new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', () => resolve(true));
        }
      }),
  );
  // const config = await renderCalled;
  const actualPath = getActualScreenshotPath(entry);
  // console.log('Attempting to take screenshot', entry, actualPath);

  try {
    await fse.ensureDir(path.dirname(actualPath));

    const screenshot = await page.screenshot({ path: actualPath });

    if (screenshot) {
      console.log('Screenshot taken successfully');
      const stats = await fse.stat(actualPath);
      console.log(`Screenshot file size: ${stats.size} bytes`);
    } else {
      console.error('Screenshot function returned null or undefined');
    }
    // if (await fse.pathExists(actualPath)) {
    //   console.log('Screenshot file exists on disk');
    // } else {
    //   console.error('Screenshot file does not exist on disk');
    // }
  } catch (error) {
    console.error('Error taking screenshot:', error);
  }

  // Remove the touch function call as it's not necessary if screenshot is working
  // await touch(actualPath);
}

async function touch(filepath: string) {
  const fd = await fse.open(filepath, 'w');
  await fse.close(fd);
}

async function renderEach(page: Page, entries: any[], options: Record<string, any>) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    await renderPage(page, entry, options);
  }
}

async function render(entries: any[], options: Record<string, any>) {
  const browser = await puppeteer.launch({
    args: options.puppeteerArgs,
    headless: Boolean(options.headless),
  });

  try {
    const page = await browser.newPage();
    page.on('error', (err) => {
      console.error('page crash', err);
    });
    page.on('pageerror', (err) => {
      console.error('uncaught exception', err);
    });
    page.on('console', (message) => {
      const type = message.type();
      if (console[type as keyof Console]) {
        // console[type as keyof Console](`console: ${message.text()}`);
      }
    });

    page.setDefaultNavigationTimeout(options.timeout);
    await exposeRender(page);
    await page.setViewport({ width: 1920, height: 1080 });
    await renderEach(page, entries, options);
  } finally {
    if (options.interactive) {
      console.info('🐛 you have thirty minutes to debug, go!');
      await sleep(30 * 60 * 1000);
    }
    browser.close();
  }
}

async function main(entries: any[], options: Record<string, any>) {
  if (options.match) {
    const exp = new RegExp(options.match);
    entries = entries.filter((entry) => exp.test(entry));
  }
  if (!options.interactive && entries.length === 0) {
    return;
  }

  const done = await serve(options);
  await sleep(2 * 1000);
  try {
    await render(entries, options);
  } finally {
    done?.();
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const options = {
  host: 'localhost',
  port: 8088,
  skipBuild: true,
  timeout: 60000,
  interactive: false,
  headless: true,
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
} as const;

console.log(playgroundRoutes);
const entries = ['/index'];

main(entries, options).catch((err) => {
  process.exit(1);
});
