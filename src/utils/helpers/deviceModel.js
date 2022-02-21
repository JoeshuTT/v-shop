/* eslint-disable */

const ua = navigator.userAgent;
/**
 * 是否安卓设备
 */
const isAndroid = /android/i.test(ua);
/**
 * 是否iOS设备
 */
const isIOS = /iphone|ipad|ipod/i.test(ua);
/**
 * 是否是Windows设备
 */
const isWindows = ua.match(/Windows NT ([\d|\d.\d]*)/i);
/**
 * 是否是Mac设备
 */
const isMac = /Macintosh|Mac/i.test(ua);
/**
 * 是否是Linux设备
 */
const isLinux = /Linux|X11/i.test(ua);
/**
 * 是否是iPadOS
 */
const isIPadOS = isMac && navigator.maxTouchPoints > 0;

/**
 * 获取设备型号
 * @description 实现原理来自 uni-app，部分设备无法获取具体型号
 * @see https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync
 */
export default function () {
  let model;

  if (isIOS) {
    const modelFind = ua.match(/\(([a-zA-Z]+);/);
    if (modelFind) {
      model = modelFind[1];
    }
  } else if (isAndroid) {
    const infoFind = ua.match(/\((.+?)\)/);
    const infos = infoFind ? infoFind[1].split(';') : ua.split(' ');

    const otherInfo = [
      /\bAndroid\b/i,
      /\bLinux\b/i,
      /\bU\b/i,
      /^\s?[a-z][a-z]$/i,
      /^\s?[a-z][a-z]-[a-z][a-z]$/i,
      /\bwv\b/i,
      /\/[\d\.,]+$/,
      /^\s?[\d\.,]+$/,
      /\bBrowser\b/i,
      /\bMobile\b/i,
    ];
    for (let i = 0; i < infos.length; i++) {
      const info = infos[i];
      if (info.indexOf('Build') > 0) {
        model = info.split('Build')[0].trim();
        break;
      }
      let other;
      for (let o = 0; o < otherInfo.length; o++) {
        if (otherInfo[o].test(info)) {
          other = true;
          break;
        }
      }
      if (!other) {
        model = info.trim();
        break;
      }
    }
  } else if (isIPadOS) {
    model = 'iPad';
  } else if (isWindows || isMac || isLinux) {
    model = 'PC';
  }

  return model;
}
