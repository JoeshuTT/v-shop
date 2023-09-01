export * from './lodash';
export * from './is';
export * from './validate';
import { getBrowserInfo } from './web/getBrowserInfo';

const clientInfo = getBrowserInfo();

/**
 * 获取链接某个参数
 * @description 兼容search，hash并存情况
 * @param {string} key 参数名称
 * @param {string} [url]  链接
 * @returns {string} 返回参数值
 * @example
 * ```js
 * getQueryString('name'); // null
 * getQueryString('name', 'http://www.baidu.com?name=1&age=2'); // 1
 * ```
 */
export function getQueryString(key: string, url: string) {
  const reg = new RegExp(`([?&]+)${key}=([^&#]*)`);
  const href = url || window.location.href;
  const results = href.substring(1).match(reg);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2]);
}

/**
 * 获取链接全部参数
 * @description 兼容search，hash并存情况
 * @param {string} [url]  链接
 * @returns {Record<string, string>} 返回包含当前URL参数的对象
 * @example
 * ```js
 * getURLParameters();
 *
 * getURLParameters('http://www.baidu.com?name=1&age=2#/demoPage?weight=3&o=4');
 * // => {name: "1", age: "2", weight: "3", o: "4"}
 * ```
 */
export function getURLParameters(url: string): Record<string, string> {
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
 * 客户端信息
 */
export function getClientInfo() {
  return clientInfo;
}

/**
 * rpx2px
 * @param {number} n
 * @param {number} [destWidth] 设计稿基准屏幕宽度
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
 */
export function getAPI(code = 'api') {
  const host: string = import.meta.env.PROD ? import.meta.env.VITE_APP_API_HOST : location.host;
  const origin = `${location.protocol}//${host}`;
  const basePath = import.meta.env.PROD ? `/${import.meta.env.VITE_APP_SUB_DOMAIN}` : '/dev-api';
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
 * 动态引入静态资源
 */
export function getAssetsUrl(name: string) {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
}
