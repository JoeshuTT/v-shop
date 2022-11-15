import { router } from '@/router';
import { getDevicePlatform } from '@/utils';
import deviceModel from '@/utils/helpers/deviceModel';
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
      '设备型号',
      deviceModel(),
      '是否Android',
      getDevicePlatform().isAndroid,
      '是否iOS',
      getDevicePlatform().isIOS,
      '是否微信内打开',
      getDevicePlatform().isInWeChatApp,
      '是否小程序内打开',
      getDevicePlatform().isInMiniProgram,
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
