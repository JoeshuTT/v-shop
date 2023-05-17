# 目录结构

项目文件的组织结构

## 目录

```
├── README.md
├── src
│   ├── apis  # 请求接口
│   ├── assets  # 静态资源
│   ├── components  # 通用业务组件（全局可用）
│   ├── constants # 全局常量
│          └── modules  # 模块拆分
│          └── index.ts
│   ├── hooks # 全局hooks
│   ├── model # 全局model
│          └── modules  # 模块拆分
│          └── index.ts
│   ├── router # 路由配置
│   ├── store  # 状态管理中心
│          └── modules  # 模块拆分
│          └── index.ts
│   ├── styles  # 全局样式
│   ├── types  # Typescript 类型
│   └── utils  # 工具库
│          └── web # web相关
│          └── request # 请求封装
│          └── ...
│          └── index
│   ├── views  # 页面
│   └── App.vue  # 视图入口
│   └── components.d.ts  # 按需引入组件声明文件
│   └── main.ts  # 入口文件
├── index.html
├── package.json
│── tsconfig.json
```
