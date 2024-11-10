import type { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { setupRouterGuard } from './guard';
import routes from './routes';

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/**
 * 配置路由
 */
export function setupRouter(app: App) {
  app.use(router);
  setupRouterGuard(router);
}
