module.exports = {
  root: true,
  env: { 
    browser: true, 
    node: true, 
  },
  globals: { 
    uni: true,
    wx: true,
  },
  extends: ['alloy', 'alloy/vue'],
  rules: {
    // 自定义你的规则
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-invalid-this': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: [['template', 'script'], 'style'],
      },
    ],
  },
};
