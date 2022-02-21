/* eslint-disable */

/**
 * @description 打开 vConsole 面板
 * 支持url带参数唤起 vconsole=show
 * 测试环境下自动打开 vConsole 面板
 */

import { getDevicePlatform } from '@/utils';

if (show()) {
  let storeList = [];
  let methodList = ['log', 'info', 'warn', 'debug', 'error'];
  methodList.forEach(function (item) {
    let method = console[item];

    console[item] = function () {
      storeList.push({
        logType: item,
        logs: arguments,
      });

      method.apply(console, arguments);
    };
  });

  loadScript('https://cdn.jsdelivr.net/npm/vconsole@3/dist/vconsole.min.js', function () {
    if (typeof vConsole === 'undefined') {
      // eslint-disable-next-line no-undef
      window.vConsole = new VConsole({
        maxLogNumber: 5000,
      });

      for (let i = 0; i < storeList.length; i++) {
        const item = storeList[i];
        window.vConsole.log.log(...item.logs);
      }
    }
  });
}

/**
 * 是否展示 vconsole
 */
function show() {
  if (window.location.href.includes('vconsole=show')) {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    if (!getDevicePlatform().isInWeChatDevTools && process.env.VUE_APP_ENV === 'test') {
      return true;
    }
  }

  return false;
}

/**
 * 加载动态脚本
 * @param {*} src
 * @param {*} callback
 */
function loadScript(src, callback) {
  let s;
  let t;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
  s.onload = function () {
    callback();
  };
}
