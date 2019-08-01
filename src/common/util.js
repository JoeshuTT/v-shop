(function localStorage() {
  if (!window.localStorage) {
    alert('浏览器不支持localstorage')
    return false;
  }
  // return window.localStorage
})()

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
// 函数防抖 debounce 
export const debounce = function (fn, delay) {
  let last = 0, timer = null
  return function () {
    let context = this
    let args = arguments
    let now = +new Date()

    if (now - last < delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}
// 函数节流 throttle
export const throttle = function (fn, interval) {
  let last = 0
  return function () {
    let context = this
    let args = arguments
    let now = +new Date()

    if (now - last >= interval) {
      last = now;
      fn.apply(context, args);
    }
  }
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
// (new Date()).format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

export default {
  storage,
  sessionStorage,
  debounce,
  throttle,
} 