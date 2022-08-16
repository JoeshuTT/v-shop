const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * 是否有值
 * @param {*} val
 */
export function isDef<T = unknown>(val?: T): val is T {
  return val !== undefined && val !== null;
}

/**
 * 是否是字符串
 * @param {*} str
 */
export function isString(val: unknown): val is string {
  return is(val, 'String');
}

/**
 * 是否是数字
 * @param {*} val
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

/**
 * 是否是函数
 * @param {*} val
 */
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

/**
 * 是否是对象
 * @param {*} val
 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

/**
 * 是否是数组
 * @param {*} val
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

/**
 * 是否为空数据
 */
export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

/**
 * 是否是本地资源路径
 */
export function isSrc(val: string) {
  const reg = /^https?/gi;
  if (reg.test(val)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 是否是手机号
 * @description 国内有效手机号码，不包括（台湾+886、香港+852、澳门+853）
 *
 */
export function isMobile(val: string) {
  const value = val.replace(/[^-|\d]/g, '');
  return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
}

/**
 * 是否是邮箱
 */
export function isEmail(val: string) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(val);
}

/**
 * 图形验证码
 * @description 4位大小写字母、数字组合
 */
export function isCaptchaCode(val: string) {
  const reg = /^[0-9A-Za-z]{4}$/;
  return reg.test(val);
}

/**
 * 账户名称
 * @param {string} val
 * @description 1到32位的数字、字母、下划线组合，不能以下划线、横线开头
 */
export function isUserName(val: string) {
  const reg = /^(?!_)(?!-)\w{1,31}[a-zA-Z0-9]$/;
  return reg.test(val);
}

/**
 * 账户密码
 * @param {string} val
 * @description 8-25位大小写字母、数字或数字加字母的形式
 */
export function isPassWord(val: string) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,25}$/;
  return reg.test(val);
}

/**
 * 数据是否一致
 * @param {string} target
 * @param {string} source
 */
export function isSame(target: any, source: any) {
  return Object.is(target, source);
}
