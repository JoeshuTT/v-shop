const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const path = require('path')

console.info(process.env.NODE_ENV)

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false, // 去掉打包后js中，会自动生成的一些map文件
  devServer: {
    port: 8080, // 端口
    proxy: {
      '/api': {
        target: 'http://wx.lohike.net',
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false, // 设置支持https协议的代理
        pathRewrite: { '^/api': '' }
      },
      '/shop_api': {
        target: 'https://api.it120.cc/xiaochengxu',
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false, // 设置支持https协议的代理
        pathRewrite: { '^/shop_api': '' }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@styles', resolve('src/styles'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            browsers: ['Android >= 4.0', 'iOS >= 7']
          }),
          pxtorem({
            rootValue: 50,
            unitPrecision: 3,
            propList: ['*', '!font*'],
            selectorBlackList: ['.ignore ', '.hairlines', 'van-circle__layer', '.van-hairline'],
            minPixelValue: 2
          })
        ]
      }
    }
  }
}
