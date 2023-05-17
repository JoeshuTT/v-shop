<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
  show: { type: Boolean },
  list: { type: Array as PropType<Recordable[]>, default: () => [] },
});

// const active = ref(0);
const emit = defineEmits(['update:show', 'success']);

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'font-size': '14px',
};

function close() {
  updateShow(false);
}

function open() {
  updateShow(true);
}

function updateShow(value: boolean) {
  emit('update:show', value);
}

defineExpose({
  open,
  close,
  updateShow,
});
</script>

<template>
  <van-popup :show="show" round closeable position="bottom" :style="popupStyle" @update:show="updateShow">
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

<style lang="less" scoped>
.steps {
  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: var(--color-text-1);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    max-height: 80vh;

    :deep(.van-step__title) {
      color: var(--color-text-3);
    }

    :deep(.van-step__title--active) {
      color: var(--color-green);
    }
  }
}
</style>
