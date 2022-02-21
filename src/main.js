import '@/utils/helpers/vconsole';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Vant
import Vant, { Lazyload } from 'vant';
import 'vant/lib/index.less';

Vue.use(Lazyload);
Vue.use(Vant);

// guard
import './router/guard';

// global
import './styles/index.less';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
