import { createPageStackRouter } from 'vue-page-stack-router';
import { router } from '@/router';
// types
import type { App } from 'vue';

export const pageStackRouter = createPageStackRouter({
  router,
});

/**
 * 配置页面栈
 */
export function setupPageStackRouter(app: App) {
  app.use(pageStackRouter);
}
