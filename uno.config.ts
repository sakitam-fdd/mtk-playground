import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

export default defineConfig({
  shortcuts: {
    'wh-full': 'w-full h-full',
    'fixed-center': 'fixed-lt flex-center wh-full',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    'ellipsis-text': 'nowrap-hidden text-ellipsis',
    'transition-base': 'transition-all duration-300 ease-in-out',
  },
  rules: [['b4', { 'border-radius': '4px' }]],
  presets: [
    presetUno(), // 默认预设
    presetIcons({
      collections: {
        custom: FileSystemIconLoader('./src/assets/svg'),
      },
      extraProperties: {
        display: 'inline-block',
      },
      scale: 1,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      primary: 'rgb(var(--primary-color))',
    },
  },
  transformers: [transformerDirectives()],
});
