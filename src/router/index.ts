import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { setupRouterGuard } from './guard';
// types
import type { App } from 'vue';

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
