import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    name: 'home',
    component: () => import('@/pages/home/home'),
    meta: {
      title: '首页'
    }
  },
  {
    name: 'user',
    component: () => import('@/pages/user/user'),
    meta: {
      title: '会员中心'
    },
    children:[
      
    ]
  },
  {
    name: 'cart',
    component: () => import('@/pages/cart/cart'),
    meta: {
      title: '购物车'
    }
  },
  {
    name: 'login',
    component: () => import('@/pages/login/login'),
    meta: {
      title: '登录'
    }
  },
  {
    name: 'goods-detail',
    component: () => import('@/pages/goods-detail/goods-detail'),
    meta: {
      title: '商品详情'
    }
  },
  {
    name: 'goods-reputation',
    component: () => import('@/pages/goods-reputation/goods-reputation'),
    meta: {
      title: '全部评价'
    }
  },
  {
    name: 'order-submit',
    component: () => import('@/pages/order-submit/order-submit'),
    meta: {
      title: '待付款的订单'
    }
  },
  {
    name: 'order-list',
    component: () => import('@/pages/order-list/order-list'),
    meta: {
      title: '订单列表'
    }
  },
  {
    name: 'order-detail',
    component: () => import('@/pages/order-detail/order-detail'),
    meta: {
      title: '订单详情'
    }
  },
  {
    name: 'address-list',
    component: () => import('@/pages/address-list/address-list'),
    meta: {
      title: '管理收货地址'
    }
  },
  {
    name: 'address-edit',
    component: () => import('@/pages/address-edit/address-edit'),
    meta: {
      title: '管理收货地址'
    }
  },
  {
    name: 'coupons',
    component: () => import('@/pages/user/coupons'),
    meta: {
      title: '我的优惠券'
    }
  },
  {
    name: 'setting',
    component: () => import('@/pages/user/setting'),
    meta: {
      title: '我的资料'
    }
  },
  {
    name: 'favgoods',
    component: () => import('@/pages/user/favgoods'),
    meta: {
      title: '我的收藏'
    }
  },
  {
    name: 'cashlog',
    component: () => import('@/pages/user/cashlog'),
    meta: {
      title: '资金明细'
    }
  },
  {
    name: 'refund',
    component: () => import('@/pages/refund/refund'),
    meta: {
      title: '退款/售后'
    }
  },
  {
    name: 'refund-apply',
    component: () => import('@/pages/refund/refund-apply'),
    meta: {
      title: '申请售后'
    }
  },
]

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
})

const router = new Router({routes})

// add route title
router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default router
