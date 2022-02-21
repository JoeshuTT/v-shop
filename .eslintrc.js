// @ts-check
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    uni: true,
    wx: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['alloy', 'alloy/typescript', 'alloy/vue'],
  rules: {
    // 自定义你的规则
    'no-console': 'off',
    // js 和 ts 的规则重合
    'no-undef': 'off',
    // vue3 和 vue2 rules 冲突
    'vue/no-v-model-argument': 'off',
    'vue/no-multiple-template-root': 'off',
    // 'vue/no-duplicate-attributes': 'off',
    // 'vue/no-v-for-template-key': 'off',
  },
});
