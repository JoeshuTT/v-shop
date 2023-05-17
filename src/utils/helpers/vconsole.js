/* eslint-disable */

/**
 * 支持动态加载 vconsole 面板，调试定位错误
 * 1. 支持 vConsole 面板展示
 * 2. 支持 url 带参数（vconsole=show）唤起
 */

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

  loadScript('https://fastly.jsdelivr.net/npm/vconsole@3/dist/vconsole.min.js', function () {
    if (typeof vConsole === 'undefined') {
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
