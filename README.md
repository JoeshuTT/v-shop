# v-shop
前端基于vue,后端使用api工厂供的免费接口和云后台,实现一个商城
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
#### 文件结构
```
├─assets
├─common
│  └─styles
├─components
│  └─load-more
└─pages
    ├─address-edit
    ├─address-list
    ├─cart
    ├─goods-detail
    ├─goods-reputation
    ├─home
    ├─login
    ├─order-detail
    ├─order-list
    ├─order-submit
    └─user
```
### Rem 适配
```
// postcss 插件，用于将单位转化为 rem
npm install postcss-pxtorem --save-dev
// 用于设置 rem 基准值
npm install amfe-flexible --save
```
https://juejin.im/entry/5982e89d5188253d774a1e9e

### 数据来源
```
https://m.mi.com/
```
### 阿里云短信
AccessKeyId	AccessKeySecret
LTAIcItFW6Ilh5KW	iCOp9El80dsr6MUM8ClLwhNyLWK6UY

### 用户本地信息
```
window.localStorage.setItem('token',JSON.stringify('7d389fdb-537f-4142-825c-79e8f46c18c3'))
window.localStorage.setItem('uid',JSON.stringify('869081'))
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
