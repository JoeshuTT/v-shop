import Axios from 'axios'
import Qs from 'qs'
import router from '@/router'
// import { Dialog } from 'vant';

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  setTimeout(() => {
    router.replace({
      path: '/login',
      query: { redirect: router.currentRoute.fullPath }
    })
  }, 1500)
}
/**
 * 请求响应异常
 * 打印状态码,输出在控制台上
 */
const errorTips = (response) => {
  // console.warn(`web request ${response.config.url}，status： ${response.status}，statusText： ${response.statusText}`)
  console.group('Ajax 错误')
  console.log('request: ', `${response.config.url}`)
  console.log('status: ', `${response.status}`)
  console.log('status: ', `${response.statusText}`)
  console.groupEnd()
}

// 默认请求地址
Axios.defaults.baseURL = process.env.VUE_APP_BASE_API // url = base url + request url
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Axios.defaults.timeout = 10 * 1000
// 请求(http request)拦截器 提前处理

// 响应(http response)拦截器 处理异常
Axios.interceptors.response.use(
  res => {
    // console.log(res)
    if (res.status === 200) {
      if (res.data.code === 2000) {
        // 全局错误码[2000]：当前登录token无效，请重新登录
        // console.log(res.data.msg)
        // Dialog.alert({
        //     title: '提示',
        //     message: res.data.msg
        //   }).then(() => {
        //     // on close
        //     router.replace({path:'/login'})
        //   });
        toLogin()
      }
      return res
    }
  },
  error => {
    // console.log(JSON.stringify(error))
    const { response } = error
    if (response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      errorTips(response)
      return Promise.reject(response)
    } else {
      // 网络超时,断网,请求不存在等
      alert('哎呦，网络开小差了≧﹏≦!')
      return Promise.reject(error)
    }
  }
)

const request = {
  get(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      Axios.get(url, { params: data, ...config })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  post(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      Axios.post(url, Qs.stringify(data), config)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  uploadFile(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      Axios.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' }, ...config })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default request
