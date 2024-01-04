// @ts-nocheck
/**
 * 加载移动端网页调试面板
 * @param {string} panelType 面板类型 [vconsole | eruda]
 */
export async function loadMobileConsole(panelType = 'vconsole') {
  if (panelType === 'vconsole') {
    await loadVconsole();
  } else if (panelType === 'eruda') {
    await loadEruda();
  } else {
    console.error('[mobileConsole]', 'panelType must be vconsole or eruda');
  }
}

export function loadVconsole() {
  return new Promise((resolve) => {
    if (window['___whistle.inspect-is-inited'] || window.__VCONSOLE_INSTANCE || window.VConsole) {
      resolve();
      return;
    }

    // 在生产环境下，最好是下载对应文件，并托管在你自己的服务器或 CDN 上
    loadScript('//unpkg.com/vconsole/dist/vconsole.min.js', (err) => {
      if (err) {
        console.error(err);
        resolve();
      }

      // eslint-disable-next-line no-undef, no-new
      new VConsole();
      resolve();
    });
  });
}

export function loadEruda() {
  return new Promise((resolve) => {
    if (window.eruda) {
      resolve();
      return;
    }

    // 在生产环境下，最好是下载对应文件，并托管在你自己的服务器或 CDN 上
    loadScript('//unpkg.com/eruda/eruda.js', (err) => {
      if (err) {
        console.error(err);
        resolve();
        return;
      }

      // eslint-disable-next-line no-undef
      eruda.init();
      resolve();
    });
  });
}

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
  s.onerror = function (err) {
    callback(err);
  };
}
