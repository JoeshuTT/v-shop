export * from './scroll';

export function stopPropagation(event: Event) {
  event.stopPropagation();
}

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

/**
 * 插入`style`标签
 */
export function appendStyle(css: string, id: string, replace = true) {
  let style = document.getElementById(id);
  if (style && replace) {
    document.head.removeChild(style);
    style = null;
  }

  if (!style) {
    const el = document.createElement('style');
    el.type = 'text/css';
    el.id = id;
    el.textContent = css;

    document.head.appendChild(el);
  }
}

/**
 * 动态加载样式
 * @description 加载 css 文件
 * @param path 外部资源 url 地址
 * @param props `link`标签支持的属性
 */
export function loadCss(path: string, props = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const css = document.querySelector(`link[href="${path}"]`);

    if (!css) {
      const newCss = document.createElement('link');

      newCss.rel = 'stylesheet';
      newCss.href = path;

      Object.keys(props).forEach((key) => {
        newCss[key] = props[key];
      });

      document.head.appendChild(newCss);

      newCss.onload = resolve;
      newCss.onerror = reject;
    }
  });
}

/**
 * 动态加载脚本
 * @description 加载 js 文件
 * @param path 外部资源 url 地址
 * @param props `script`标签支持的属性
 */
export function loadScript(path: string, props = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const script = document.querySelector(`script[src="${path}"]`);

    if (!script) {
      const newScript = document.createElement('script');
      newScript.type = 'text/javascript';
      newScript.src = path;

      Object.keys(props).forEach((key) => {
        newScript[key] = props[key];
      });

      document.body.appendChild(newScript);

      newScript.onload = resolve;
      newScript.onerror = reject;
    }
  });
}
