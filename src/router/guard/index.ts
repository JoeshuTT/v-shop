import { router } from '@/router';
import { getClientInfo } from '@/utils';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useAppStoreWithOut } from '@/store/modules/app';

let appLoadedFlag: boolean; // 应用窗口加载标记

router.beforeEach(async (to, from, next) => {
  console.log('[route]', from.path, to.path);
  // add route title
  const title = to.meta?.title as string | undefined;
  if (title) {
    document.title = title;
  }

  // 应用窗口加载
  if (!appLoadedFlag) {
    appLoadedFlag = true;
    console.info('app onLaunch');
    console.info('app version', __APP_INFO__.version);
    console.info('app URL', window.location.href);

    console.info(
      '[用户信息] 设备信息：',
      '设备类型',
      getClientInfo().deviceType,
      '是否Android',
      getClientInfo().isAndroid,
      '是否iOS',
      getClientInfo().isIOS,
      '是否微信内打开',
      getClientInfo().isInWeChatApp,
      '是否小程序内打开',
      getClientInfo().isInMiniProgram,
    );

    // PC 浏览提示
    // 请使用移动设备访问或者pc 上F12打开，获取最佳使用体验

    // 更新主题
    const appStore = useAppStoreWithOut();
    await appStore.updateTheme();
  }

  const userStore = useUserStoreWithOut();
  const token = userStore.getToken;

  // 需要登录
  if (to.meta.needLogin && !token) {
    const redirect = to.path || '/';

    next({
      path: '/login',
      query: {
        ...to.query,
        redirect,
      },
    });
    return;
  }

  next();
});
