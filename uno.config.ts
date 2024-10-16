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
        icon: FileSystemIconLoader('./src/assets/icon'),
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
      primary: 'var(--el-color-primary)',
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#121723',
      dark: '#1D2430',
      yellow: '#FBB040',
      'bg-color-dark': '#171C28',
      'body-color': {
        DEFAULT: '#788293',
        dark: '#959CB1',
      },
      stroke: {
        stroke: '#E3E8EF',
        dark: '#353943',
      },
      gray: {
        dark: '#1E232E',
        light: '#F0F2F9',
      },
    },
  },
  transformers: [transformerDirectives()],
});
