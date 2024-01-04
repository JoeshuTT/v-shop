import type { Router } from 'vue-router';

export function createPageTitleGuard(router: Router) {
  router.afterEach((to) => {
    // 页面标题
    const title = to.meta?.title as string | undefined;
    if (title) {
      document.title = title;
    }
  });
}
