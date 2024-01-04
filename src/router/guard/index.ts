import type { Router } from 'vue-router';
// store
import { useAppStoreWithOut } from '@/store/modules/app';
import { createPageTitleGuard } from './pageTitleGuard';
import { createPermissionGuard } from './permissionGuard';

let appLoadedFlag: boolean; // 应用窗口加载标记

/**
 * 配置全局路由守卫
 */
export function setupRouterGuard(router: Router) {
  const appStore = useAppStoreWithOut();

  router.beforeEach(async (to, from, next) => {
    console.log('[route]', from.path, to.path);
    // 应用窗口加载
    if (!appLoadedFlag) {
      appLoadedFlag = true;

      // PC 浏览提示
      // 请使用移动设备访问或者pc 上F12打开，获取最佳使用体验

      // 更新主题
      await appStore.updateTheme();
    }

    next();
  });
  createPageTitleGuard(router);
  createPermissionGuard(router);
}
