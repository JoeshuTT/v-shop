import { nextTick, onMounted, onActivated } from 'vue';

/**
 * 页面加载时，业务逻辑只执行一次
 * @description 可用于页面栈
 */
export function onMountedOrActivated(callback: () => void): void {
  let mounted: boolean;

  onMounted(() => {
    callback();
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      callback();
    }
  });
}
