import '@/utils/helpers/vconsole';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { createPageStackRouter } from 'vue-page-stack-router';
import { store } from './store';

// Vant
import Vant, { Lazyload } from 'vant';
import 'vant/lib/index.less';

// guard
import './router/guard';

// global
import './styles/index.less';

// app
const app = createApp(App);

// pageStackRouter
const pageStackRouter = createPageStackRouter({ router });

app.use(Lazyload);
app.use(Vant);
app.use(router);
app.use(pageStackRouter);
app.use(store);
app.mount('#app');
