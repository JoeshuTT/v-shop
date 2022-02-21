<template>
  <van-popup
    :value="value"
    round
    closeable
    position="bottom"
    class="steps-popup"
    @click-close-icon="onClose"
    @click-overlay="onClose"
  >
    <div class="steps-header">订单跟踪</div>
    <div class="steps-body">
      <van-steps direction="vertical" :active="list.length - 1">
        <van-step v-for="(item, index) in list" :key="index">
          <div class="steps-item-label">{{ item.typeStr }}</div>
          <div class="steps-item-time">{{ item.dateAdd }}</div>
        </van-step>
      </van-steps>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    value: Boolean,
    list: Array,
  },
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    onClose() {
      this.$emit('input', false);
    },
    onOpen() {
      this.$emit('input', true);
    },
  },
};
</script>

<style lang="less" scoped>
.steps {
  &-popup {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    font-size: 14px;
    background: #fff;
  }

  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: var(--gray-color-8);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    max-height: 80vh;

    ::v-deep .van-step__title {
      color: var(--gray-color-6);
    }

    ::v-deep .van-step__title--active {
      color: var(--green-color);
    }
  }
}
</style>
