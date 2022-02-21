const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/category/index.vue'),
    meta: {
      title: '分类',
    },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/cart/index.vue'),
    meta: {
      title: '购物车',
    },
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('@/views/mine/index.vue'),
    meta: {
      title: '我的',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
    meta: {
      title: '注册',
    },
  },
  {
    path: '/resetPwd',
    name: 'resetPwd',
    component: () => import('@/views/resetPwd/index.vue'),
    meta: {
      title: '重置密码',
    },
  },
  {
    path: '/order/list',
    name: 'orderList',
    component: () => import('@/views/order/list.vue'),
    meta: {
      title: '订单列表',
    },
  },
  {
    path: '/order/detail',
    name: 'orderDetail',
    component: () => import('@/views/order/detail.vue'),
    meta: {
      title: '订单详情',
    },
  },
  {
    path: '/order/submit',
    name: 'orderSubmit',
    component: () => import('@/views/order/submit.vue'),
    meta: {
      title: '提交订单',
    },
  },
  {
    path: '/order/payResult',
    name: 'orderPayResult',
    component: () => import('@/views/order/payResult.vue'),
    meta: {
      title: '支付结果',
    },
  },
  {
    path: '/refund',
    name: 'refund',
    component: () => import('@/views/refund/index.vue'),
    meta: {
      title: '退款/售后',
    },
  },
  {
    path: '/refund/apply',
    name: 'refundApply',
    component: () => import('@/views/refund/apply.vue'),
    meta: {
      title: '申请售后',
    },
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: () => import('@/views/coupon/index.vue'),
    meta: {
      title: '我的优惠券',
    },
  },
  {
    path: '/integral',
    name: 'integral',
    component: () => import('@/views/integral/index.vue'),
    meta: {
      title: '积分中心',
    },
  },
  {
    path: '/integral/rule',
    name: 'integralRule',
    component: () => import('@/views/integral/rule.vue'),
    meta: {
      title: '积分规则',
    },
  },
  {
    path: '/integral/scoreLog',
    name: 'integralScoreLog',
    component: () => import('@/views/integral/scoreLog.vue'),
    meta: {
      title: '积分明细',
    },
  },
  {
    path: '/integral/exchange',
    name: 'integralExchange',
    component: () => import('@/views/integral/exchange.vue'),
    meta: {
      title: '积分兑换',
    },
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('@/views/wallet/index.vue'),
    meta: {
      title: '我的钱包（资产）',
    },
  },
  {
    path: '/wallet/cashLog',
    name: 'walletCashLog',
    component: () => import('@/views/wallet/cashLog.vue'),
    meta: {
      title: '资金记录',
    },
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/address/index.vue'),
    meta: {
      title: '收货地址',
    },
  },
  {
    path: '/address/edit',
    name: 'addressEdit',
    component: () => import('@/views/address/edit.vue'),
    meta: {
      title: '编辑收货地址',
    },
  },
  {
    path: '/good/detail',
    name: 'goodDetail',
    component: () => import('@/views/good/detail.vue'),
    meta: {
      title: '商品详情',
    },
  },
  {
    path: '/good/reputation',
    name: 'goodReputation',
    component: () => import('@/views/good/reputation.vue'),
    meta: {
      title: '全部评价',
    },
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/setting/index.vue'),
    meta: {
      title: '设置',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: '编辑资料',
    },
  },
  {
    path: '/theme',
    name: 'theme',
    component: () => import('@/views/theme/index.vue'),
    meta: {
      title: '主题风格',
    },
  },
  // errorPage
  {
    path: '/test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      title: '加载异常',
    },
  },
  {
    path: '/reload',
    component: () => import('@/views/error/reload.vue'),
    meta: {
      title: '加载异常',
    },
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '找不到页面',
    },
  },
  // 404 Not found
  { path: '/:path(.*)*', redirect: '/404' },
];

export default routes;
