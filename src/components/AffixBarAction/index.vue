<script lang="ts" setup>
defineProps({
  buttonText: { type: String, default: '完成' },
});

const emit = defineEmits(['submit']);

function onClicked() {
  emit('submit');
}
</script>

<template>
  <div class="affix-bar">
    <div class="affix-bar-action">
      <slot>
        <van-button class="affix-bar-button" type="primary" @click="onClicked">{{ buttonText }}</van-button>
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.affix-bar {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));

  &-action {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background-color: var(--white);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }

  &-button {
    width: 50%;
    height: 34px;
    border-radius: 4px;
    letter-spacing: 2px;
  }
}
</style>
