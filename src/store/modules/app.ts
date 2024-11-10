import type { ITheme } from '@/constants/modules/app/types';
import { tabBar, theme } from '@/constants/modules/app';
import { store } from '@/store';
import { deepClone, fromCamelCase, getClientInfo, goodStorage } from '@/utils';
import { appendStyle } from '@/utils/web';
import { defineStore } from 'pinia';

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
    getTheme: state => state.theme,
    getTabBar: state => state.tabBar,
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
        key => `--color-${fromCamelCase(key, '-')}: ${myTheme.colors[key]};`,
      );
      const vanVarList = Object.keys(myTheme.vanThemeOverrides).map(
        key =>
          `--van-${fromCamelCase(key, '-')}: ${
            myTheme.colors[myTheme.vanThemeOverrides[key]] ?? myTheme.vanThemeOverrides[key]
          };`,
      );

      const cssText = `:root { ${[...colorVarList, ...vanVarList].join('\n')} }`;
      appendStyle(cssText, 'theme');

      this.theme = myTheme;
      goodStorage.set('theme', myTheme);
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
  const result = goodStorage.get('theme', theme);
  if (result.version === theme.version) {
    return result;
  } else {
    return theme;
  }
}
