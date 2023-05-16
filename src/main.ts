import { createApp } from 'vue';
import App from './App.vue';
import { store } from './store';
import { router } from './router';
import { setupPageStackRouter } from './router/pageStack';
// guard
import './router/guard';
// Vant
import Vant, { Lazyload } from 'vant';
import 'vant/lib/index.css';
// global
import './styles/index.less';

// app
const app = createApp(App);

app.use(Lazyload);
app.use(Vant);
app.use(router);
setupPageStackRouter(app);
app.use(store);
app.mount('#app');
