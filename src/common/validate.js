/**
 * 是否是字符串类型
 * @param {string} str
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * 是否是数组类型
 * @param {array} arg
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
/**
 * 是否是手机号码格式
 * @param {string} value
 */
export function isPhone(value) {
  const reg = /^1[0-9]{10}$/
  return reg.test(value)
}
/**
 * 是否为空数据
 * @param {*} obj
 */

export function isEmpty(obj) {
  if (obj == null) {
    return true
  }
  if (isArray(obj)) {
    return obj.length === 0
  }
  if (isString(obj)) {
    return !`${obj}`.trim().length
  }
  if (JSON.stringify(obj) === '{}') {
    return true
  }
  return false
}
/**
 * 是否是邮箱格式
 * @param {string} value
 */
export function isEmail(value) {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  return reg.test(value)
}
/**
 * 是否为纯数字格式
 * @param {string} value
 */
export function isNumber(value) {
  return /^\d+$/.test(value)
}
