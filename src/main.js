import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

import 'vant/lib/index.css';
import request from './common/request'
// import 'amfe-flexible'
// import { Tabbar, TabbarItem } from 'vant';
// Vue.use(Tabbar).use(TabbarItem);

// 引入 Vant 基础组件及弹窗
import { Button ,Cell, CellGroup,Icon,Image ,Row, Col, Popup , } from 'vant'
import { Toast ,Dialog } from 'vant'  // 会自动在 Vue 的 prototype 上挂载 $toast ,$dialog 方法
Vue.use(Button).use(Cell).use(CellGroup).use(Icon).use(Row).use(Col).use(Popup)
// 使用Image  会保install 错误,可能是测试版本的原因
Vue.prototype.$request = request
// 创建全局的 EventBus (全局的事件总线)
Vue.prototype.$bus = new Vue()

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
