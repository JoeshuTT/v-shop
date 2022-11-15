/**
 * 函数节流
 * @param {callback} fn 事件回调
 * @param {number} interval 时间间隔的阈值
 */
export function throttle(fn: any, interval: number) {
  let last = 0;
  return function () {
    // @ts-ignore
    // eslint-disable-next-line
    const context = this;
    const args = arguments;
    const now = Number(new Date());

    if (now - last >= interval) {
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 函数防抖
 * @param {callback} fn 事件回调
 * @param {number} delay 每次推迟执行的等待时间
 */
export function debounce(fn: any, delay: number) {
  let last = 0;
  let timer: any = null;
  return function () {
    // @ts-ignore
    // eslint-disable-next-line
    const context = this;
    const args = arguments;
    const now = Number(new Date());

    if (now - last < delay) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 深拷贝
 * @param {*} sources 源对象
 * @returns {*} 拷贝后的新对象
 */
export function deepClone(sources: any): any {
  const target = Array.isArray(sources) ? [] : {};
  for (const key in sources) {
    if (Object.hasOwn(sources, key)) {
      // @ts-ignore
      target[key] = sources[key] !== null && typeof sources[key] === 'object' ? deepClone(sources[key]) : sources[key];
    }
  }

  return target;
}

/**
 * 生成指定两个整数范围内的随机整数
 * @param {number} m
 * @param {number} n
 * @example random(0, 10)
 */
export const randomIntegerInRange = function (m: number, n: number) {
  return m + Math.floor(Math.random() * (n - m));
};

/**
 * 转换驼峰拼写的字符串为特定格式
 * @description 使用 String.replace() 去除下划线，连字符和空格，并将驼峰拼写格式的单词转换为全小写。省略第二个参数 separator ，默认使用_分隔符。
 */
export function fromCamelCase(str: string, separator = '_') {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase();
}
