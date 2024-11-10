import { createApp } from 'vue';
import App from './App.vue';
import { setupVant } from './components/registerVant';
import { setupRouter } from './router';
import { setupPageStackRouter } from './router/pageStack';
import { setupStore } from './store';
import { consoleAppInfo, loadMobileConsole } from './utils';

// global
import './styles/index.less';

async function bootstrap() {
  // 开发调试：测试环境开启调试面板
  if (location.href.includes('测试域名')) {
    await loadMobileConsole('vconsole');
  } else if (location.href.includes('vconsole=show') || localStorage.getItem('vconsole') === 'show') {
    await loadMobileConsole('vconsole');
  } else if (location.href.includes('eruda=show') || localStorage.getItem('eruda') === 'show') {
    await loadMobileConsole('eruda');
  }
  // 应用信息
  consoleAppInfo();
  // app
  const app = createApp(App);

  setupRouter(app);
  setupPageStackRouter(app);
  setupStore(app);
  setupVant(app);

  app.mount('#app');
}

bootstrap();
