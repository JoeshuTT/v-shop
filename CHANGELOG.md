# 更新日志

> 记录下重大改动

## v3.6.1(2024-11)

> 翻译翻译什么叫最佳实践

feat: release v3.6.1

- 从头开始进行代码审查，保证代码质量
- 要求`node`版本在18.x以上，在`package.json`文件中增加选项

```json
"engines": {
  "node": ">= 18",
  "pnpm": ">= 9"
},
```

- 一律使用esm写法，在`package.json`文件中增加选项

```json
type: "module"
```

更新应用依赖大版本

```text
"axios": "^0.21.4" -> ^1.7.7
"@vueuse/core": "^7.7.1" -> ^11.2.0
```

- 弃用`AlloyTeam ESLint`方案，使用`@antfu/eslint-config`
- 使用`StyleLint`来做CSS代码检查(linter)
- `typescript`升级到 5.x、参考 [vue官方-搭配 TypeScript 使用 Vue](https://cn.vuejs.org/guide/typescript/overview.html) 配置`tsconfig.json`

应用迭代

- 支付结果页改成简单显示
- 下单页面增加优惠券选择

## v3.5.1(2023-05-17)

主要改动

- 请求封装增加扩展配置项
- types 目录调整
- 主题支持**暗黑模式**
- 通用列表重构，支持组件和 hooks 两种方式使用
  - 组件`AppList`, `AppInfiniteScroller`, `ProList` 使用查看
    页面 coupon,order,wallet 等等
- utils 新增更多工具函数
  - 更新`Web API`相关方法，`utils/web`目录下，废弃
    getDevicePlatform deviceId.js deviceModel.js，使用 getClientInfo, getBrowserInfo
- 短信验证码逻辑重构，使用组件形式
- 升级 Vite 到 3.x 版本，并对相关的 Vite 插件进行升级
- 升级 Vant 到 4.x 版本，相关使用方式同步更新
- 配置文件增加注释说明
- 优化代码逻辑和其他细节完善

## v3.1.3(2023-03-20)

主要改动

- 优化代码逻辑和其他细节完善

## v3.1.2(2022-08-16)

主要改动

- 新增依赖 `unplugin-vue-components`, `vue-page-stack-router`
- types 目录调整
- utils 重构优化
- 优化代码逻辑和其他细节完善

## v3.0.1(2022-08-16)

主要改动

- 更新依赖，更新 `eslint alloy`配置
- 优化代码逻辑和其他细节完善

## v3.0.0(2022-02-21)

v3 大版本

- :rocket: v3 [Vue 3 + Vite 2](https://v-shop.shuzp.top/)

## v2.0.0(2022-02-21)

v2 大版本

- :tada: v2 [Vue 2 + Vue CLI 4.5](https://v-shop.shuzp.top/v2/)

## v1.0.0 (2019-07-12)

```
# v-shop
基于vue,使用api工厂提供的免费接口和云后台,实现一个线上商城
```

## v0.0.0 (2019-05-23)

`v-shop` 开工
