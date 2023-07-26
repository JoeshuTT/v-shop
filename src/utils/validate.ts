import { isString, isArray, isObject } from './is';

/**
 * 是否为空数据
 */
export function isEmpty<T = unknown>(val: T): val is T {
  if (val === null || val === undefined) {
    return true;
  }

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
 * 是否是数值
 * @param val
 */
export function isNumeric(val: number | string) {
  return typeof val === 'number' || /^\d+(\.\d+)?$/.test(val);
}

/**
 * 是否是手机号
 * @description 手机号(mobile phone)中国(最宽松), 只要是1开头即可
 */
export function isMobile(val: string) {
  const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
  return reg.test(val);
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
