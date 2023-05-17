import { ref, onUnmounted } from 'vue';

/**
 * 倒计时
 */
export function useCountDown() {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const count = ref(0);

  function start(initialValue = 0) {
    count.value = initialValue;
    timer = setInterval(() => {
      console.log(count.value);
      if (count.value > 0) {
        count.value--;
      } else {
        stop();
      }
    }, 1000);
  }

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  onUnmounted(() => {
    stop();
  });

  return {
    count,
    start,
    stop,
  };
}
