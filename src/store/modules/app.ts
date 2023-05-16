import { defineStore } from 'pinia';
import { store } from '@/store';
import storage from 'good-storage';
import { theme, tabBar } from '@/constants/modules/app';
import type { ITheme } from '@/constants/modules/app/types';
import { deepClone, fromCamelCase } from '@/utils/lodash';
import { appendStyle } from '@/utils/web';
import { getClientInfo } from '@/utils';

export interface AppStore {
  theme: NonNullable<ITheme>;
  tabBar: NonNullable<Recordable>;
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppStore => ({
    theme: getLocalTheme(),
    tabBar,
  }),
  getters: {
    getTheme: (state) => state.theme,
    getTabBar: (state) => state.tabBar,
  },
  actions: {
    async updateTheme(payload: Recordable = {}) {
      const myTheme: ITheme = { ...deepClone(this.theme), ...payload };

      // 切换主题深/浅
      if (payload.mode === 'system') {
        myTheme.mode = getClientInfo().theme;
      }
      if (myTheme.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // 生成主题变量
      const colorVarList = Object.keys(myTheme.colors).map(
        (key) => `--color-${fromCamelCase(key, '-')}: ${myTheme.colors[key]};`,
      );
      const vanVarList = Object.keys(myTheme.vanThemeOverrides).map(
        (key) =>
          `--van-${fromCamelCase(key, '-')}: ${
            myTheme.colors[myTheme.vanThemeOverrides[key]] ?? myTheme.vanThemeOverrides[key]
          };`,
      );

      const cssText = `:root { ${[...colorVarList, ...vanVarList].join('\n')} }`;
      appendStyle(cssText, 'theme');

      this.theme = myTheme;
      storage.set('theme', myTheme);
    },
    /**
     * 切换暗黑模式
     */
    toggleThemeMode() {
      this.updateTheme({
        mode: this.theme.mode === 'dark' ? 'light' : 'dark',
      });
    },
  },
});

export function useAppStoreWithOut() {
  return useAppStore(store);
}

function getLocalTheme() {
  const result = storage.get('theme', theme);
  if (result.version === theme.version) {
    return result;
  } else {
    return theme;
  }
}
