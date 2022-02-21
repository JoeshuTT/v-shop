import storage from 'good-storage';
import { deepClone } from '@/utils';
import { theme, tabBar } from '@/utils/constant';

export default {
  namespaced: true,
  state: {
    theme: storage.get('theme', theme),
    tabBar,
  },
  getters: {
    theme: (state) => state.theme,
    tabBar: (state) => state.tabBar,
  },
  mutations: {
    setTheme(state, payload) {
      state.theme = payload;
      storage.set('theme', payload);
    },
    setTabBar(state, payload) {
      state.tabBar = payload;
    },
  },
  actions: {
    async updateTheme({ commit }, payload = {}) {
      const { colors } = payload;
      const myTheme = deepClone(theme);

      Object.keys(colors).forEach((key) => {
        if (myTheme[key]) {
          myTheme[key] = colors[key];
        }
        if (myTheme.colors[key]) {
          myTheme.colors[key] = colors[key];
        }
      });

      commit('setTheme', myTheme);
    },
  },
};
