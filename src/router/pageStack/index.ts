import type { App } from 'vue';
import { router } from '@/router';
import { createPageStackRouter } from 'vue-page-stack-router';

export const pageStackRouter = createPageStackRouter({
  router,
});

/**
 * 配置页面栈
 */
export function setupPageStackRouter(app: App) {
  app.use(pageStackRouter);
}
