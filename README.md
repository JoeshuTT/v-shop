# v-shop 商城(H5端)
一个前端基于vue，后端使用api工厂供的免费接口和云后台实现的移动端商城

- 项目地址  
[http://wx.shuzp.top](http//:wx.shuzp.top)

- 项目二维码(手机扫码)  
![项目二维码](https://s2.ax1x.com/2020/02/11/1TPJKS.png)

## 项目设置
```
npm install
```

### 项目本地调试和热更新
```
npm run serve
```

### 项目本地打包用于发布线上
```
npm run build
```
## 功能清单
- [x] 订单管理
  - [x] 创建订单
  - [x] 订单列表
  - [x] 订单详情(取消订单,付款,确认收货,评价,退换货)
  - [x] 系统钱包支付订单
- [x] 用户管理
  - [x] 用户注册/登录(手机号-手机接收验证码注册)
  - [x] 用户资产
  - [x] 用户信息(详情,修改)
  - [x] 收货地址(详情,修改,添加,删除)
  - [x] 我的收藏
  - [ ] 资金明细(加入充值/提现)
- [x] 优惠券
- [x] 购物车
- [x] 商城模块
  - [x] 商品列表
  - [x] 商品详情
    - [x] 商品规格(支持无规格，最多支持3种规格)
    - [x] 商品收藏
    - [x] 商品评价
    - [ ] 商品分享海报(普通商品,砍价,拼团商品等海报)
- [ ] 积分模块
- [x] 拼团/砍价
- [ ] 微信开发(公众号)
  - [ ] 微信支付
  - [ ] 用户注册/登录(微信公众号-快速注册/登录)
  - [ ] 绑定手机号
  - [ ] 微信分享给朋友
  - [ ] 微信支付
- [ ] 定制主题
- [ ] 页面路由缓存栈

## 项目截图
上传图片会被截掉,换成点链接查看

[项目截图](https://s2.ax1x.com/2020/02/11/1T9Bon.jpg)  

[拼团截图](https://s2.ax1x.com/2020/02/11/1T9yWV.jpg)  

[砍价截图](https://s2.ax1x.com/2020/02/11/1T9riq.jpg)
## 项目结构
```
src -- 源码目录
├── assets -- 静态图片资源文件
├── commmon -- 公用js
    ├── area.js -- 全国城市区数据JSON
    ├── flexible.js -- 可伸缩布局方案
    ├── request.js -- axios网络请求封装
    ├── util.js -- 工具类
    ├── validate.js -- 正则效验函数
    ├── validator.js -- 表单验证集合
├── components -- 通用组件封装 
├── router.js -- vue-router路由配置
├── store.js -- vuex的状态管理
├── styles -- 全局css样式
└── pages -- 前端页面
    ├── login -- 登录页
    ├── home -- 首页
    ├── user -- 用户中心
    ├── cart -- 购物车
    └── ... -- 其他页面
```
## 商品数据来源
```
https://m.mi.com/
```
## Rem 适配
项目编写过程中样式直接使用 `px`作为单位 ，然后再用工具转化

1. 引入`flexible` 用于设置 rem 基准值
```
// main.js
import './common/flexible'
```
2. 安装 `postcss-pxtorem` 用于将单位转化为 rem

`$ npm install postcss-pxtorem --save-dev`
```
// vue.config.js
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

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
          minPixelValue: 2,
        })
      ]
    }
  }
}
```

## 联系我
舒志平

联系方式：1442702103@qq.com  
微信：f144270