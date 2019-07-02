import Axios from 'axios'
import Qs from 'qs'
import router from '@/router'
// import { Dialog } from 'vant';

// 默认请求地址
Axios.defaults.baseURL = process.env.VUE_APP_BASE_API // url = base url + request url
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// console.log(Qs)
// 请求(http request)拦截器 提前处理

// 响应(http response)拦截器 处理异常
Axios.interceptors.response.use(res => {
  if (res.data.code === 2000) {
    // console.log(res.data.msg)
    // Dialog.alert({
    //     title: '提示',
    //     message: res.data.msg
    //   }).then(() => {
    //     // on close
    //     router.replace({path:'/login'})
    //   });
    // 全局错误码[2000]：当前登录token无效，请重新登录
    setTimeout(() => {
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath }
      })
    }, 1500);
  }
  return res
})

const request = {
  get(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      Axios.get(url, { params: data, ...config })
        .then(res => {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            alert(res.data.msg)
            reject(res.data)
          }
        })
        .catch(err => {
          alert('哎呦，网络开小差了≧﹏≦!')
          reject(err)
        })
    })
  },
  post(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      Axios.post(url, Qs.stringify(data), config)
        .then(res => {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            alert(res.data.msg)
            reject(res.data)
          }
        })
        .catch(err => {
          alert('哎呦，网络开小差了≧﹏≦!')
          reject(err)
        })
    })
  },
  uploadFile(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      Axios.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' }, ...config })
        .then(res => {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            alert(res.data.msg)
            reject(res.data)
          }
        })
        .catch(err => {
          alert('哎呦，网络开小差了≧﹏≦!')
          reject(err)
        })
    })
  }
}

export default request