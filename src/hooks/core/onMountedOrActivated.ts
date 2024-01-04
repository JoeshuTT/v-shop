import { nextTick, onMounted, onActivated } from 'vue';

/**
 * 注册一个回调函数，在组件 `onMounted` 或者 `onActivated` 之后执行 (只会执行一次)
 * @description 可用于 `<KeepAlive>` 缓存过的组件
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
