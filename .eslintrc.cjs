module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
    jest: true,
    'vue/setup-compiler-macros': true,
  },
  extends: ['./.eslintrc-auto-import.json', '@aurorafe/eslint-config-vue'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    defineOptions: true,
  },
  rules: {
    // 组件配置面的值的双向绑定
    'vue/no-mutating-props': 'off',
    'vue/v-on-event-hyphenation': [
      'warn',
      'always',
      {
        autofix: true,
      },
    ],
    'vue/script-setup-uses-vars': 'error',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
  },
};
