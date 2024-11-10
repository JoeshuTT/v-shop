/**
 * 加载移动端网页调试面板
 * @param {string} panelType 面板类型 [vconsole | eruda]
 */
export async function loadMobileConsole(panelType: string = 'vconsole') {
  if (panelType === 'vconsole') {
    await loadVconsole();
  } else if (panelType === 'eruda') {
    await loadEruda();
  } else {
    console.error('[mobileConsole]', 'panelType must be vconsole or eruda');
  }
}

export function loadVconsole() {
  return new Promise<void>((resolve) => {
    // @@ts-ignore
    if ((window as any)['___whistle.inspect-is-inited'] || (window as any).__VCONSOLE_INSTANCE || (window as any).VConsole) {
      resolve();
      return;
    }

    // 在生产环境下，最好是下载对应文件，并托管在你自己的服务器或 CDN 上
    loadScript('//unpkg.com/vconsole/dist/vconsole.min.js', () => {
      // eslint-disable-next-line no-new
      new (window as any).VConsole();
      resolve();
    });
  });
}

export function loadEruda() {
  return new Promise<void>((resolve) => {
    if ((window as any).eruda) {
      resolve();
      return;
    }

    // 在生产环境下，最好是下载对应文件，并托管在你自己的服务器或 CDN 上
    loadScript('//unpkg.com/eruda/eruda.js', () => {
      (window as any).eruda.init();
      resolve();
    });
  });
}

function loadScript(src: string, callback: () => void) {
  const el = document.createElement('script');
  el.type = 'text/javascript';
  el.src = src;
  const scriptTag = document.getElementsByTagName('script')[0];
  scriptTag?.parentNode?.insertBefore(el, scriptTag);
  scriptTag.onload = callback;
  scriptTag.onerror = callback;
}
