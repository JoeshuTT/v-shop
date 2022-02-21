export { throttle, debounce, deepClone } from './lodash';

/**
 * 获取链接某个参数 search
 * @param {String} name 参数名称
 * @returns {String} 返回参数值
 */
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  // eslint-disable-next-line eqeqeq, no-eq-null
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

/**
 * 获取网址参数 search 和 hash
 * @returns {Object} 返回包含当前URL参数的对象
 *
 */
export function getURLParameters() {
  const reg = /([^?=&]+)(=([^&]*))/g;
  const searchParamList = window.location.search.match(reg);
  const hashParamList = window.location.hash.match(reg);
  const obj = {};

  searchParamList &&
    searchParamList.forEach((v) => {
      obj[v.slice(0, v.indexOf('='))] = decodeURIComponent(v.slice(v.indexOf('=') + 1));
    });

  hashParamList &&
    hashParamList.forEach((v) => {
      obj[v.slice(0, v.indexOf('='))] = decodeURIComponent(v.slice(v.indexOf('=') + 1));
    });

  return obj;
}

/**
 * 客户端平台
 * @returns {}
 */
export function getDevicePlatform() {
  const ua = navigator.userAgent.toLowerCase(); // 一律小写
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
  const isInWeChatApp = /micromessenger/i.test(ua); // 是否微信内打开
  const isInMiniProgram = /miniProgram/i.test(ua); // 是否小程序内打开
  const isInWeChatDevTools = /wechatdevtools/i.test(ua); // 是否微信开发者工具内打开

  return {
    isAndroid,
    isIOS,
    isInWeChatApp,
    isInMiniProgram,
    isInWeChatDevTools,
  };
}

/**
 * 获取接口前缀
 * @param {*} code api, host, origin
 * @returns
 */
export function getAPI(code = 'api') {
  const host = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_HOST : location.host;
  const origin = `${location.protocol}//${host}`;
  const basePath = process.env.NODE_ENV === 'production' ? '/xiaochengxu' : '/dev-api';
  const api = `${origin}${basePath}`; // 基础接口
  // const src = `${origin}${process.env.VUE_APP_BASE_API}`;

  switch (code) {
    case 'host':
      return host;
    case 'origin':
      return origin;
    // case 'src':
    //   return src;
    default:
      return api;
  }
}

/**
 * rpx2px
 * @param {Number} n
 * @param {Number} destWidth 设计稿基准屏幕宽度
 */
export function rpx2px(n, destWidth = 375) {
  const ratio = document.documentElement.clientWidth / destWidth;

  return (n * ratio).toFixed(2);
}
