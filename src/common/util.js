/**
 * 工具类
 * @author Joeshu
 */

// localStorage 简易API封装
export const storage = {
  set(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data))
  },
  get(key) {
    return JSON.parse(window.localStorage.getItem(key))
  },
  remove(key) {
    window.localStorage.removeItem(key)
  },
  clearAll() {
    window.localStorage.clear()
  }
}
// sessionStorage 简易API封装
export const sessionStorage = {
  set(key, data) {
    window.sessionStorage.setItem(key, JSON.stringify(data))
  },
  get(key) {
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  clearAll() {
    window.sessionStorage.clear()
  }
}
/**
 * 函数防抖
 * @param {callback} fn 事件回调
 * @param {number} delay 每次推迟执行的等待时间
 */
export const debounce = function(fn, delay) {
  let last = 0
  let timer = null
  return function() {
    const context = this
    const args = arguments
    const now = +new Date()

    if (now - last < delay) {
      clearTimeout(timer)
      timer = setTimeout(function() {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}
/**
 * 函数节流
 * @param {*} fn 事件回调
 * @param {*} interval 时间间隔的阈值
 */
export const throttle = function(fn, interval) {
  let last = 0
  return function() {
    const context = this
    const args = arguments
    const now = +new Date()

    if (now - last >= interval) {
      last = now
      fn.apply(context, args)
    }
  }
}

export default {
  storage,
  sessionStorage,
  debounce,
  throttle
}
