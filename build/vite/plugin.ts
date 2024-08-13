import type { Plugin } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Unocss from 'unocss/vite';
// import eslint from 'vite-plugin-eslint';
import { visualizer } from 'rollup-plugin-visualizer';
import compressPlugin from 'vite-plugin-compression';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

import { ElementPlusResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers';

import { HtmlPlugin } from './html';
import { pathResolve } from '../utils';

export function createVitePlugins(viteEnv: Record<string, any>, isBuild: boolean) {
  const useBuildAnalyzer = Boolean(viteEnv.BUILD_ANALYZER);

  const vitePlugins: Plugin | Plugin[] = [
    HtmlPlugin(viteEnv, isBuild),
    VueMacros({
      plugins: {
        vue: Vue(),
        // 支持jsx或者tsx语法 @link https://www.npmjs.com/package/@vitejs/plugin-vue-jsx
        vueJsx: VueJsx(),
      },
    }),

    AutoImport({
      // dts: path.resolve(pathSrc, 'typings', 'auto-imports.d.ts'),
      dts: 'types/auto-imports.d.ts',
      dirs: ['./src/hooks'],
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          // 全局使用 _.xxxx()
          'lodash-es': [
            // default imports
            ['*', '_'], // import { * as _ } from 'lodash-es',
          ],
        },
      ],
      // Auto import functions from UILibrary, e.g. Message, Spin, Loading, MessageBox... (with style)
      resolvers: [
        // Auto import ElementPlus components
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        IconsResolver({
          prefix: 'icon',
          customCollections: ['custom'],
        }),
        VueUseComponentsResolver(),
      ],
    }),
    Components({
      extensions: ['vue'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],
      dirs: ['src/layout/', 'src/components'],
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      resolvers: [
        // 自动导入图标组件
        IconsResolver({
          prefix: 'icon',
          customCollections: ['custom'],
        }),
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        VueUseComponentsResolver(),
      ],
      dts: 'types/components.d.ts',
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
      customCollections: {
        custom: FileSystemIconLoader(`src/assets/svg`, (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" ')),
      },
      scale: 1.2,
      defaultClass: 'inline-block',
    }),
    Unocss(),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [pathResolve('src/locales/**')],
    }),

    ...(!isBuild
      ? []
      : [
          compressPlugin({
            threshold: 10240,
            algorithm: 'gzip',
          }),
        ]),
    ...(useBuildAnalyzer
      ? [
          visualizer({
            filename: './dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ];
  return vitePlugins;
}
