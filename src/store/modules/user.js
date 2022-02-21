import storage from 'good-storage';
import API_USER from '@/apis/user';
import router from '@/router';
import { loginProviderType } from '@/utils/constant';

export default {
  namespaced: true,
  state: {
    token: storage.get('token', ''),
    userInfo: storage.get('userInfo', {}),
    userLevel: {},
  },
  getters: {
    token: (state) => state.token,
    hasLogin: (state) => !!state.token,
    userInfo: (state) => state.userInfo,
    userLevel: (state) => state.userLevel,
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
      storage.set('token', payload);
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
      storage.set('userInfo', payload);
    },
    setUserLevel(state, payload) {
      state.userLevel = payload;
    },
  },
  actions: {
    async login({ commit }, payload = {}) {
      const { provider = 'system', params } = payload;

      try {
        const loginProvider = loginProviderType[provider];

        const res = await API_USER[loginProvider.apiName](params);
        const { token } = res.data;

        commit('setToken', token);
        return res.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout({ commit, getters }, payload = {}) {
      const { goLogin = false } = payload;

      if (getters.token) {
        try {
          await API_USER.userLoginOut();
        } catch (error) {
          console.error('退出登录失败', error);
        }
      }

      commit('setToken', '');
      commit('setUserInfo', {});
      goLogin && router.push('/login');
    },
    async getUserInfo({ commit }) {
      try {
        const res = await API_USER.userDetail();
        const { base = {}, userLevel = {} } = res.data;

        commit('setUserInfo', base);
        commit('setUserLevel', userLevel);
      } catch (error) {
        console.error('获取用户详情失败', error);
      }
    },
  },
};
