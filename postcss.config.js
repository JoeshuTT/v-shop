// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 375,
      unitPrecision: 2,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', /^body$/, '.hairlines', /^\.dp/, /^\.scroller/],
      minPixelValue: 1,
      mediaQuery: false,
    },
  },
};
