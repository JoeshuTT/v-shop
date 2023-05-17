// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {},
    // 'postcss-px-to-viewport': {
    //   viewportWidth: 375,
    //   unitPrecision: 2,
    //   viewportUnit: 'vw',
    //   selectorBlackList: ['.ignore', /^body$/, '.hairlines', /^\.dp/, /^\.scroller/],
    //   minPixelValue: 1,
    //   mediaQuery: false,
    // },
    /* 限制视口单位最大值，提升桌面端可访问性 */
    'postcss-mobile-forever': {
      viewportWidth: 375, // 设计图宽度
      maxDisplayWidth: 480, // 视口单位最大值
      disableLandscape: true, // 关闭横屏媒体查询
      disableDesktop: true, // 关闭桌面端媒体查询
      selectorBlackList: ['.ignore', /^body$/, '.hairlines', /^\.dp/, /^\.scroller/],
      rootSelector: '#app', // 根选择器，用于超过最大宽度时居中视图
      rootContainingBlockSelectorList: ['van-tabbar', 'van-popup--bottom'],
      customLengthProperty: {
        rootContainingBlockList_LR: ['--placeholder'],
      },
    },
  },
};
