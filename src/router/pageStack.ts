import type { App } from 'vue';
import { createPageStackRouter } from 'vue-page-stack-router';
import { router } from './index';

export const pageStackRouter = createPageStackRouter({
  router,
});

export function setupPageStackRouter(app: App<Element>) {
  app.use(pageStackRouter);
}
