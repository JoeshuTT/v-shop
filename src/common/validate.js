/**
 * 是否是字符串
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
/**
 * @param {String} value
 */
export function isPhone(value) {
  const reg = /^1[0-9]{10}$/
  return reg.test(value)
}

export function isEmpty(value) {
  return !`${value}`.trim().length
}
export function isEmail(value) {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  return reg.test(value)
}

export function isNumber(value) {
  return /^\d+$/.test(value)
}
