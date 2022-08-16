const path = require('path');

/**
 * resolve
 * @param {*} dir
 * @returns
 */
function resolve(dir) {
  return path.join(__dirname, dir);
}

/**
 * 生成版本号（时间戳 按小时）
 * @returns {String}
 */
function getTimeStampVersion() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const padZero = (n) => String(n).padStart(2, '0');

  return `${year}${padZero(month)}${padZero(date)}${padZero(hour)}${padZero(minutes)}`;
}

const appVersion = getTimeStampVersion();
const assetsDir = 'assets';

module.exports = {
  publicPath: './',
  assetsDir: assetsDir,
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/dev-api': {
        target: 'https://api.it120.cc/xiaochengxu',
        changeOrigin: true,
        secure: false,
        ws: true,
        pathRewrite: {
          '^/dev-api': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          hack: `true; @import '~@/styles/variable.less';`,
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      // js和css 使用版本号
      config.output.filename(`${assetsDir}/js/[name].${appVersion}.js`).end();
      config.output.chunkFilename(`${assetsDir}/js/[name].${appVersion}.js`).end();
      config
        .plugin('extract-css')
        .tap((args) => {
          args[0].filename = `${assetsDir}/css/[name].${appVersion}.css`;
          args[0].chunkFilename = `${assetsDir}/css/[name].${appVersion}.css`;
          return args;
        })
        .end();
    }
    // 删除预加载
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    // HtmlWebpackPlugin
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = process.env.VUE_APP_TITLE;
        return args;
      })
      .end();
    // DefinePlugin
    config
      .plugin('define')
      .tap((args) => {
        args[0]['process.env'].APP_VERSION = appVersion;
        return args;
      })
      .end();
  },
};
