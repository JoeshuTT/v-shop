import { computed, unref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/modules/app';
import { onMountedOrActivated } from '../core/onMountedOrActivated';

export function usePage() {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const router = useRouter();

  const token = computed(() => userStore.getToken);
  const hasLogin = computed(() => !!unref(token));
  const theme = computed(() => appStore.getTheme);

  function goPage(path) {
    router.push({ path });
  }

  function goLogin() {
    router.push('/login');
  }

  function goHome() {
    router.replace('/');
  }

  return {
    token,
    hasLogin,
    theme,
    // 跳转页面
    goHome,
    goLogin,
    goPage,
    //
    onMountedOrActivated,
  };
}
