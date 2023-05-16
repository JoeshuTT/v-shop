module.exports = {
  root: true,
  extends: ['alloy', 'alloy/vue', 'alloy/typescript'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser',

      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    },
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    uni: true,
    wx: true,
  },
  rules: {
    // 自定义你的规则
    'no-console': 'off',
    // js 和 ts 的规则重合
    'no-undef': 'off',
    // @typescript-eslint
    '@typescript-eslint/prefer-optional-chain': 'off',
    // vue
    'vue/no-duplicate-attributes': [
      'error',
      {
        allowCoexistClass: true,
        allowCoexistStyle: true,
      },
    ],
  },
};
