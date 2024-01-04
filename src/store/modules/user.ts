import { defineStore } from 'pinia';
import { store } from '@/store';
import { router } from '@/router';
import { loginProviderType } from '@/constants/modules/user';
import { goodStorage } from '@/utils';
import API_USER from '@/apis/user';

export interface UserState {
  token: string;
  userInfo: NonNullable<UserInfo>;
  userLevel: NonNullable<UserLevel>;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: goodStorage.get('token', ''),
    userInfo: goodStorage.get('userInfo', {}),
    userLevel: {},
  }),
  getters: {
    getToken: (state): string => state.token,
    hasLogin: (state): boolean => !!state.token,
    getUserInfo: (state): UserInfo => state.userInfo,
    getUserLevel: (state): UserLevel => state.userLevel,
  },
  actions: {
    async login(payload: Recordable = {}) {
      const { provider = 'system', params } = payload;

      try {
        const loginProvider = loginProviderType[provider];

        const res = await API_USER[loginProvider.apiName](params);
        const { token } = res.data;

        this.token = token;
        goodStorage.set('token', token);
        return res.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout(payload: Recordable = {}) {
      const { goLogin = false } = payload;

      if (this.getToken) {
        try {
          await API_USER.userLoginOut();
        } catch (error) {
          console.error('退出登录失败', error);
        }
      }

      this.token = '';
      goodStorage.set('token', '');
      this.userInfo = {};
      goodStorage.set('userInfo', {});
      goLogin && router.push('/login');
    },
    async getUserDetail() {
      try {
        const res = await API_USER.userDetail();
        const { base = {}, userLevel = {} } = res.data;

        this.userInfo = base;
        goodStorage.set('userInfo', base);
        this.userLevel = userLevel;
      } catch (error) {
        console.error('获取用户详情失败', error);
      }
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}

export interface UserInfo {
  id?: number;
  nick?: string;
  avatar?: string;
  [key: string]: any;
}
export interface UserLevel {
  id?: number;
  [key: string]: any;
}
