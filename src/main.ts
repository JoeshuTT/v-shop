import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupPageStackRouter } from './router/pageStack';
import { setupStore } from './store';
import { setupVant } from './components/registerVant';

// global
import './styles/index.less';

async function bootstrap() {
  // app
  const app = createApp(App);

  setupRouter(app);
  setupPageStackRouter(app);
  setupStore(app);
  setupVant(app);

  app.mount('#app');
}

bootstrap();
