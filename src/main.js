import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

import 'vant/lib/index.css';
import request from './common/request'
import './common/flexible'

// 引入 Vant 基础组件及弹窗
import { Button, Cell, CellGroup, Icon, Row, Col, Popup, Toast, Dialog } from 'vant'

Vue.use(Button).use(Cell).use(CellGroup).use(Icon).use(Row).use(Col).use(Popup)
// 使用Image  会保install 错误,可能是测试版本的原因
Vue.prototype.$toast = Toast
Vue.prototype.$dialog = Dialog
Vue.prototype.$request = request


new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
