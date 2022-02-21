import { defineStore } from 'pinia';
import { store } from '@/store';
import storage from 'good-storage';
import { theme, ITheme, tabBar, ITabBar } from '@/constants/modules/app';
import { useStyleTag } from '@vueuse/core';
import { fromCamelCase } from '@/utils/lodash';
export interface AppStore {
  theme: NonNullable<ITheme>;
  tabBar: NonNullable<ITabBar>;
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppStore => ({
    theme: storage.get('theme', theme),
    tabBar,
  }),
  getters: {
    getTheme: (state): ITheme => state.theme,
    getTabBar: (state): ITabBar => state.tabBar,
  },
  actions: {
    async updateTheme(payload: Recordable = {}) {
      const { colors } = payload;
      const myTheme: ITheme = this.theme;

      colors &&
        Object.keys(colors).forEach((key) => {
          if (myTheme[key]) {
            myTheme[key] = colors[key];
          }
          if (myTheme.colors[key]) {
            myTheme.colors[key] = colors[key];
          }
        });

      // 覆盖Vant 的基础变量
      myTheme.colors[`van-blue`] = myTheme.colors[`brandColor`];

      // 生成主题变量
      const cssVarList = Object.keys(myTheme.colors).map(
        (key) => `--${fromCamelCase(key, '-')}: ${myTheme.colors[key]};`,
      );

      const cssText = `:root { ${cssVarList.join('\n')} }`;

      useStyleTag(cssText, { id: 'theme' });
      this.theme = myTheme;
      storage.set('theme', myTheme);
    },
  },
});

export function useAppStoreWithOut() {
  return useAppStore(store);
}
