import { computed, defineComponent, unref } from 'vue';
import { useAppStore } from '@/store/modules/app';

export default defineComponent({
  name: 'AppProvider',
  setup(_props, { slots }) {
    const appStore = useAppStore();
    const theme = computed(() => appStore.getTheme);

    const themeVars = computed(() => {
      return {
        black: unref(theme).colors.black,
        white: unref(theme).colors.white,
        // Tabs
        'tabs-default-color': unref(theme).brandColor,
        'tabs-bottom-bar-color': unref(theme).brandColor,
        // Sidebar
        'sidebar-selected-border-color': unref(theme).brandColor,
        // Dialog
        'dialog-confirm-button-text-color': unref(theme).brandColor,
        // ActionBar
        'action-bar-button-warning-color': unref(theme).viceColor,
        'action-bar-button-danger-color': unref(theme).brandColor,
      };
    });

    return () => {
      return <van-config-provider themeVars={unref(themeVars)}>{slots.default?.()}</van-config-provider>;
    };
  },
});
