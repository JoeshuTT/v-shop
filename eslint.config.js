import antfu from '@antfu/eslint-config';

export default antfu(
  {
    type: 'app',
    stylistic: {
      // 行尾需要有分号
      semi: true,
    },
    typescript: true,
    vue: true,
  },
  {
    rules: {
      /**
       * 大括号风格
       */
      'style/brace-style': ['error', '1tbs'],
      /**
       * 禁止使用 console
       * @reason console.log 是一个很常见的操作
       */
      'no-console': 'off',
      /**
       * 禁止在定义变量之前就使用它
       * @reason 编译阶段检查就足够了
       */
      'no-use-before-define': 'off',
      'ts/no-use-before-define': 'off',
    },
  },
  {
    files: [
      '**/*.vue',
    ],
    rules: {
      /**
       * 限制自定义组件的属性风格
       */
      'vue/attribute-hyphenation': 'off',
    },
  },
);
