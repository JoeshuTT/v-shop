import { getDevicePlatform } from '@/utils';
import router from '@/router';

let appLoadedFlag; // 应用窗口加载标记

router.beforeEach(async (to, from, next) => {
  console.log('[route]', from.path, to.path);
  // add route title
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  // 应用窗口加载

  if (!appLoadedFlag) {
    appLoadedFlag = true;
    console.info('app onLaunch');
    console.info('app version', process.env.APP_VERSION);
    console.info('app URL', window.location.href);
    console.info(
      '[用户信息] 设备信息: 是否安卓',
      getDevicePlatform().isAndroid,
      '是否IOS',
      getDevicePlatform().isIOS,
      '是否微信内打开',
      getDevicePlatform().isInWeChatApp,
      '是否小程序内打开',
      getDevicePlatform().isInMiniProgram,
    );
  }

  next();
});
