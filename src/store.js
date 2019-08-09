import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    globalData: {
      comment: 'v-shop',
      desc: '一个前端基于vue，后端使用api 工厂提供的免费接口和云后台实现的移动端商城'
    },
    defaultAddress: {},
    userInfo: {
      avatarUrl: '',
      nick: '',
      province: '',
      city: '',
      mobile: ''
    }
  },
  mutations: {
    increment(state) {
      state.count++
    },
    updateDefaultAddress(state, address) {
      state.defaultAddress = address
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = Object.assign(state.userInfo, userInfo)
    }
  }
})
export default store
