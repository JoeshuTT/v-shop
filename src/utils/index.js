export { throttle, debounce, deepClone } from './lodash';

/**
 * 获取链接某个参数 search
 * @param {string} name 参数名称
 * @param {*} url
 * @returns {string} 返回参数值
 * @example
 * getQueryString('name');
 * getQueryString('name', 'http://www.baidu.com?name=1&age=2');
 */
export function getQueryString(name, url) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = (url || window.location.search).substr(1).match(reg);
  // eslint-disable-next-line eqeqeq, no-eq-null
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

/**
 * 获取网址参数 search 和 hash
 * @param {*} url
 * @returns {Object} 返回包含当前URL参数的对象
 * @example
 * getURLParameters();
 * getURLParameters('http://www.baidu.com?name=1&age=2#test?name=1&age=2');
 */
export function getURLParameters(url) {
  const reg = /([^?=&]+)(=([^&]*))/g;
  const search = url ? url.split('#/')[0] : window.location.search;
  const hash = url ? url.split('#/')[1] : window.location.hash;
  const searchParamList = search.match(reg);
  const hashParamList = hash.match(reg);
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
 */
export function getAPI(code = 'api') {
  const host = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_HOST : location.host;
  const origin = `${location.protocol}//${host}`;
  const basePath = process.env.NODE_ENV === 'production' ? '/xiaochengxu' : '/dev-api';
  const api = `${origin}${basePath}`; // 基础接口

  switch (code) {
    case 'host':
      return host;
    case 'origin':
      return origin;
    default:
      return api;
  }
}

/**
 * rpx2px
 * @param {number} n
 * @param {number} destWidth 设计稿基准屏幕宽度
 */
export function rpx2px(n, destWidth = 375) {
  const ratio = document.documentElement.clientWidth / destWidth;

  return Number((n * ratio).toFixed(2));
}
