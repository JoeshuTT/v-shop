<template>
  <div class="text">hello</div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const color = ref('blue');
    const font = ref({
      size: '2em',
    });

    return {
      color,
      font,
    };
  },
});
</script>

<style lang="less">
.text {
  color: v-bind(color);

  /* expressions (wrap in quotes) */
  font-size: v-bind('font.size');
}
</style>
