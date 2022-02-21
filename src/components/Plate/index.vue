<template>
  <div class="plate">
    <div class="plate-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

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
  background: var(--white);

  &-title {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--gray-color-8);
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
    color: var(--gray-color-6);
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
    color: var(--gray-color-6);
  }
}
</style>
