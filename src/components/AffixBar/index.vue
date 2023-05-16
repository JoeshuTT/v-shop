<script setup lang="ts">
defineProps({
  text: { type: String, default: '完成' },
  size: { type: String, default: 'small' },
});

const emit = defineEmits(['clickBtn']);

function onBtnClicked() {
  emit('clickBtn');
}
</script>

<template>
  <div :class="['affix-bar', `affix-bar--${size}`]">
    <div class="affix-bar-action">
      <slot>
        <van-button class="affix-bar-button" type="primary" @click="onBtnClicked">{{ text }}</van-button>
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.affix-bar {
  height: calc(50px + var(--safe-area-height-bottom));

  &-action {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding-bottom: var(--safe-area-height-bottom);
    background-color: var(--color-bg-1);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }

  &-button {
    width: 50%;
    height: 34px;
    border-radius: 4px;
    letter-spacing: 2px;
  }

  &--medium &-button {
    width: 80%;
  }
}
</style>
