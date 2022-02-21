// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,
      unitPrecision: 2,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines', /^\.dp/, /^\.scroller/],
      minPixelValue: 1,
      mediaQuery: false,
    },
  },
};
