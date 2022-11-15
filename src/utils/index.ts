export { throttle, debounce, deepClone } from './lodash';

/**
 * 获取链接某个参数
 * @param {string} key 参数名称
 * @param {string} [url]  链接
 * @returns {string} 返回参数值
 * @example
 * getQueryString('name');
 * getQueryString('name', 'http://www.baidu.com?name=1&age=2');
 */
export function getQueryString(key: string, url: string): string {
  const reg = new RegExp(`([?&]+)${key}=([^&#]*)`);
  const href = url || window.location.href;
  const matches = href.substring(1).match(reg);

  return matches ? decodeURIComponent(matches[2]) : '';
}

/**
 * 获取链接全部参数
 * @description 兼容search，hash并存情况
 * @param {string} [url]  链接
 * @returns {Record<string, string>} 返回包含当前URL参数的对象
 * @example
 * getURLParameters();
 * getURLParameters('http://www.baidu.com?name=1&age=2#/demoPage?weight=3&o=4');
 */
export function getURLParameters(url: string) {
  const reg = /([^?=&]+)(=([^&#]*))/g;
  const href = url || window.location.href;
  const matchList = href.match(reg) || [];
  const obj = {};

  matchList.forEach((v) => {
    obj[v.slice(0, v.indexOf('='))] = decodeURIComponent(v.slice(v.indexOf('=') + 1));
  });

  return obj;
}

/**
 * 客户端平台
 */
export function getDevicePlatform(): Record<string, boolean> {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
  const isMobile = Boolean(isAndroid || isIOS);
  const isDesktop = /(Win32|Win64|MacIntel|Linux x86_64)/i.test(platform);
  const isInWeChatApp = /micromessenger/i.test(ua); // 是否微信内打开
  const isInMiniProgram = /miniProgram/i.test(ua); // 是否小程序内打开
  const isInWeChatDevTools = /wechatdevtools/i.test(ua); // 是否微信开发者工具内打开

  return {
    isAndroid,
    isIOS,
    isMobile,
    isDesktop,
    isInWeChatApp,
    isInMiniProgram,
    isInWeChatDevTools,
  };
}

/**
 * rpx2px
 * @param {number} n
 * @param {number} destWidth 设计稿基准屏幕宽度
 */
export function rpx2px(n: number, destWidth = 375) {
  const ratio = document.documentElement.clientWidth / destWidth;

  return (n * ratio).toFixed(2);
}

/**
 * 动态扩展运行时环境
 */
export function getEnv() {
  let ENV = 'dev';
  if (/正式域名/.test(location.host)) {
    ENV = 'prod';
  } else if (/测试域名/.test(location.host)) {
    ENV = 'test';
  } else {
    ENV = 'dev';
  }

  return {
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    ENV,
  };
}

/**
 * 获取接口前缀
 * @param {string} code api, host, origin
 */
export function getAPI(code = 'api') {
  const host: string = import.meta.env.PROD ? import.meta.env.VITE_APP_API_HOST : location.host;
  const origin = `${location.protocol}//${host}`;
  const basePath = import.meta.env.PROD ? '/xiaochengxu' : '/dev-api';
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
