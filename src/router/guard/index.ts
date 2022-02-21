import { Notify } from 'vant';
import { getDevicePlatform } from '@/utils';
import deviceModel from '@/utils/helpers/deviceModel';
import { toRouteType } from '@/router/types';
import { router } from '@/router';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useAppStoreWithOut } from '@/store/modules/app';

let appLoadedFlag: boolean; // 应用窗口加载标记
const whitePathList: string[] = [
  '/',
  '/home',
  '/category',
  '/cart',
  '/mine',
  '/login',
  '/register',
  '/resetPwd',
  '/test',
  '/theme',
];

router.beforeEach(async (to: toRouteType, from, next) => {
  console.log('[route]', from.path, to.path);
  // add route title
  const title = to.meta?.title;
  if (title) {
    document.title = title;
  }

  // 应用窗口加载
  if (!appLoadedFlag) {
    appLoadedFlag = true;
    console.info('app onLaunch');
    // console.info('app version', process.env.APP_VERSION);
    console.info('app version', __APP_INFO__.version);
    console.info('app URL', window.location.href);

    console.info(
      '[用户信息] 设备信息: ',
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
    //
    if (deviceModel() === 'PC' && document.documentElement.clientWidth >= 750) {
      Notify({
        color: '#ed6a0c',
        background: '#fffbe8',
        message: '请使用移动设备访问或者pc 上F12打开，获取最佳使用体验',
      });
    }
    // 更新主题
    const appStore = useAppStoreWithOut();
    await appStore.updateTheme();
  }

  const userStore = useUserStoreWithOut();

  const token = userStore.getToken;

  if (!(token || whitePathList.includes(to.path))) {
    const redirect = to.path || '/';

    console.log({
      path: '/login',
      query: {
        ...to.query,
        redirect,
      },
    });
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
