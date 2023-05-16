<script setup lang="ts">
defineProps({
  title: String,
});
</script>

<template>
  <div class="plate">
    <div class="plate-title">{{ title }}</div>
  </div>
</template>

<style lang="less" scoped>
.plate {
  background: none;
}

.plate {
  text-align: center;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-bg-2);

  &-title {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--color-text-1);
    font-weight: bold;
  }

  &-title::before {
    content: '';
    background: url('@/assets/images/line_askew.png');
    background-size: cover;
    width: 20px;
    height: 6px;
    position: absolute;
    left: -30px;
    top: 25px;
    font-size: 12px;
    color: var(--color-text-3);
  }

  &-title::after {
    content: '';
    background: url('@/assets/images/line_askew.png');
    background-size: cover;
    width: 20px;
    height: 6px;
    position: absolute;
    right: -30px;
    top: 25px;
    font-size: 12px;
    color: var(--color-text-3);
  }
}

.dark {
  .plate-title::after,
  .plate-title::before {
    display: none;
  }
}
</style>
