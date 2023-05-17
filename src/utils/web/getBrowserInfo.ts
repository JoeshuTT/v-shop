/* eslint-disable */
// @ts-nocheck
const ua = navigator.userAgent;

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

const isAndroid = /android/i.test(ua);
const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
const isInWeChatApp = /micromessenger/i.test(ua);
const isInMiniProgram = /miniProgram/i.test(ua);
const isInWeChatDevTools = /wechatdevtools/i.test(ua);

export type DeviceType = 'phone' | 'pad' | 'pc' | 'unknow';

export interface BrowserInfo {
  theme: 'light' | 'dark';
  deviceType: DeviceType;
  deviceId: string;
  /**
   * 是否安卓
   */
  isAndroid: boolean;
  /**
   * 是否iOS
   */
  isIOS: boolean;
  /**
   * 是否移动端设备
   */
  isMobile: boolean;
  /**
   * 是否微信内打开
   */
  isInWeChatApp: boolean;
  /**
   * 是否微信小程序内打开
   */
  isInMiniProgram: boolean;
  /**
   * 是否微信开发者工具内打开
   */
  isInWeChatDevTools: boolean;
  [key: string]: any;
}

/**
 * 获取浏览器信息
 *
 * @see https://uniapp.dcloud.net.cn/api/system/info.html#getsysteminfosync
 */
export function getBrowserInfo(): Readonly<BrowserInfo> {
  let language = navigator.language;
  let osname;
  let osversion;
  let model;
  let deviceType = 'phone';

  if (isIOS) {
    osname = 'iOS';
    const osversionFind = ua.match(/OS\s([\w_]+)\slike/);
    if (osversionFind) {
      osversion = osversionFind[1].replace(/_/g, '.');
    }
    const modelFind = ua.match(/\(([a-zA-Z]+);/);
    if (modelFind) {
      model = modelFind[1];
    }
  } else if (isAndroid) {
    osname = 'Android';
    // eslint-disable-next-line no-useless-escape
    const osversionFind = ua.match(/Android[\s/]([\w\.]+)[;\s]/);
    if (osversionFind) {
      osversion = osversionFind[1];
    }
    const infoFind = ua.match(/\((.+?)\)/);
    const infos = infoFind ? infoFind[1].split(';') : ua.split(' ');
    // eslint-disable-next-line no-useless-escape
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
    osname = 'iOS';
    osversion = typeof window.BigInt === 'function' ? '14.0' : '13.0';
    deviceType = 'pad';
  } else if (isWindows || isMac || isLinux) {
    model = 'PC';
    osname = 'PC';
    deviceType = 'pc';
    const osversionFind = ua.match(/\((.+?)\)/)[1];

    if (isWindows) {
      osname = 'Windows';
      osversion = '';
      switch (isWindows[1]) {
        case '5.1':
          osversion = 'XP';
          break;
        case '6.0':
          osversion = 'Vista';
          break;
        case '6.1':
          osversion = '7';
          break;
        case '6.2':
          osversion = '8';
          break;
        case '6.3':
          osversion = '8.1';
          break;
        case '10.0':
          osversion = '10';
          break;
      }

      const framework = osversionFind.match(/[Win|WOW]([\d]+)/);
      if (framework) {
        osversion += ` x${framework[1]}`;
      }
    } else if (isMac) {
      osname = 'macOS';
      osversion = osversionFind.match(/Mac OS X (.+)/) || '';

      if (osversion) {
        osversion = osversion[1].replace(/_/g, '.');
        // '10_15_7' or '10.16; rv:86.0'
        if (osversion.indexOf(';') !== -1) {
          osversion = osversion.split(';')[0];
        }
      }
    } else if (isLinux) {
      osname = 'Linux';
      osversion = osversionFind.match(/Linux (.*)/) || '';

      if (osversion) {
        osversion = osversion[1];
        // 'x86_64' or 'x86_64; rv:79.0'
        if (osversion.indexOf(';') !== -1) {
          osversion = osversion.split(';')[0];
        }
      }
    }
  } else {
    osname = 'Other';
    osversion = '0';
    deviceType = 'unknown';
  }

  let system = `${osname} ${osversion}`;
  let platform = osname.toLocaleLowerCase();

  let browserName = '';
  let browserVersion = String(IEVersion());
  if (browserVersion !== '-1') {
    browserName = 'IE';
  } else {
    const browseVendors = ['Version', 'Firefox', 'Chrome', 'Edge{0,1}'];
    const vendors = ['Safari', 'Firefox', 'Chrome', 'Edge'];
    for (let index = 0; index < browseVendors.length; index++) {
      const vendor = browseVendors[index];
      const reg = new RegExp(`(${vendor})/(\\S*)\\b`);
      if (reg.test(ua)) {
        browserName = vendors[index];
        browserVersion = ua.match(reg)[2];
      }
    }
  }

  // deviceOrientation
  let deviceOrientation = 'portrait';
  const orientation =
    typeof window.screen.orientation === 'undefined' ? window.orientation : window.screen.orientation.angle;
  deviceOrientation = Math.abs(orientation) === 90 ? 'landscape' : 'portrait';

  return {
    deviceBrand: undefined,
    brand: undefined,
    deviceModel: model,
    deviceOrientation,
    model,
    system,
    platform,
    browserName: browserName.toLocaleLowerCase(),
    browserVersion,
    language,
    deviceType,
    ua,
    osname,
    osversion,
    // 常用
    theme: getTheme(),
    deviceId: getDeviceId(),
    isAndroid,
    isIOS,
    isMobile: isAndroid || isIOS,
    isInWeChatApp,
    isInMiniProgram,
    isInWeChatDevTools,
  };
}

export function IEVersion() {
  const userAgent = navigator.userAgent;
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE;
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion > 6) {
      return fIEVersion;
    } else {
      return 6;
    }
  } else if (isEdge) {
    return -1;
  } else if (isIE11) {
    return 11;
  } else {
    return -1;
  }
}

export function getTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch (error) {
    return 'light';
  }
}

/**
 * 获取设备唯一标记
 * @description 实现原理来自 uni-app getsysteminfo，清空 Storage 会导致改变
 */
export function getDeviceId() {
  const UUID_KEY = '__DC_STAT_UUID';
  const storage = window.localStorage || window.sessionStorage || {};
  let deviceId = storage[UUID_KEY];

  if (!deviceId) {
    deviceId = String(Date.now()) + Math.floor(Math.random() * 1e7);
    try {
      storage[UUID_KEY] = deviceId;
    } catch (error) {}
  }

  return deviceId;
}
