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
 * @param {*} source 源对象
 * @returns 拷贝后的新对象
 */
export function deepClone<T = any>(source: {}): T {
  const target: any = Array.isArray(source) ? [] : {};
  // eslint-disable-next-line guard-for-in
  for (const key in source) {
    target[key] = source[key] !== null && typeof source[key] === 'object' ? deepClone(source[key]) : source[key];
  }

  return target;
}

/**
 * 生成指定两个整数范围内的随机整数
 * @param {number} m
 * @param {number} n
 * @example
 * ```js
 * random(0, 10)  // 1
 * ```
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

/**
 * 将源对象中属性名与目标对象相同的属性值映射到目标对象中
 */
export function mapMatchingProperties(target: {}, source: {}) {
  Object.keys(target).forEach((key) => {
    if (key in source) {
      target[key] = source[key];
    }
  });

  return target;
}
