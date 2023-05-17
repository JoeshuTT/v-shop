import { computed, defineComponent, unref } from 'vue';
import type { ConfigProviderThemeVars } from 'vant';
import { useAppStore } from '@/store/modules/app';
import AppWindowBar from '../AppWindowBar/index.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'AppProvider',
  setup(_, { slots }) {
    const appStore = useAppStore();
    const route = useRoute();
    const theme = computed(() => appStore.getTheme);

    const themeVars = computed<ConfigProviderThemeVars>(() => {
      return {
        // ActionBar
        ActionBarButtonWarningColor: unref(theme).colors.vice,
        actionBarButtonDangerColor: unref(theme).colors.primary,
      };
    });

    return () => {
      return (
        <van-config-provider theme={unref(theme).mode} themeVars={unref(themeVars)}>
          {slots.default?.()}
          {route.meta.showWindowBar && <AppWindowBar />}
        </van-config-provider>
      );
    };
  },
});
