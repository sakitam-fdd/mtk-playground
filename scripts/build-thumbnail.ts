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

function getActualScreenshotPath(entry: Entries) {
  return path.join(baseDir, `../public/thumbnails/${entry.name}.webp`);
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

async function renderPage(page: Page, entry: Entries, options: Record<string, any>) {
  const renderCalled = new Promise((resolve) => {
    handleRender = (config: any) => {
      handleRender = null;
      resolve(config || {});
    };
  });
  console.log(`Screenshot ${entry.name} start`);

  try {
    // Test for webgl support
    // e.g. https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
    // const webgl = await page.evaluate(() => {
    //   const canvas = document.createElement('canvas');
    //   const gl = canvas.getContext('webgl');
    //   const expGl = canvas.getContext('experimental-webgl');
    //
    //   return {
    //     gl: gl && gl instanceof WebGLRenderingContext,
    //     expGl: expGl && expGl instanceof WebGLRenderingContext,
    //   };
    // });

    // await page.waitForSelector(".content");

    // const config = await renderCalled;
    const actualPath = getActualScreenshotPath(entry);
    await page.goto(`http://${options.host}:${options.port}${entry.path}`, {
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

    await fse.ensureDir(path.dirname(actualPath));

    const screenshot = await page.screenshot({ path: actualPath, type: 'webp' });

    if (screenshot) {
      const stats = await fse.stat(actualPath);
      console.log(`Screenshot ${entry.name} successfully, file size: ${stats.size} bytes`);
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

async function renderEach(page: Page, entries: Entries[], options: Record<string, any>) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    await renderPage(page, entry, options);
  }
}

async function render(entries: Entries[], options: Record<string, any>) {
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

    // ua && (await page.setUserAgent(ua));

    // 拦截请求
    // await page.setRequestInterception(true);
    //
    // page.on('request', async (request) => {
    //   if (
    //     request.resourceType() === 'image' ||
    //     request.resourceType() === 'font' ||
    //     request.resourceType() === 'stylesheet'
    //   ) {
    //     await request.abort();
    //   } else {
    //     await request.continue();
    //   }
    // });

    await exposeRender(page);
    await page.setViewport({ width: 900, height: 530 });
    await renderEach(page, entries, options);
  } finally {
    if (options.interactive) {
      console.info('🐛 you have thirty minutes to debug, go!');
      await sleep(30 * 60 * 1000);
    }
    browser.close();
  }
}

interface Entries {
  path: string;
  name: string;
}

async function main(entries: Entries[], options: Record<string, any>) {
  if (options.match) {
    const exp = new RegExp(options.match);
    entries = entries.filter((entry) => exp.test(entry.path));
  }
  if (!options.interactive && entries.length === 0) {
    return;
  }

  const done = await serve(options);
  await sleep(2 * 1000);
  try {
    await render(entries, options);
  } catch (e) {
    console.error('main', e);
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

const BASE_URL = '/pls';
function buildEntries() {
  const entries = [];
  for (let i = 0; i < playgroundRoutes.length; i++) {
    const category = playgroundRoutes[i];

    if (category.children) {
      for (let j = 0; j < category.children.length; j++) {
        const sub = category.children[j];

        if (sub.children) {
          for (let k = 0; k < sub.children.length; k++) {
            const item = sub.children[k];
            entries.push({
              path: `${BASE_URL}/${category.path}/${sub.path}/${item.path}`,
              name: item.name as string,
            });
          }
        }
      }
    }
  }

  return entries;
}

main(buildEntries(), options).catch((err) => {
  process.exit(1);
});
