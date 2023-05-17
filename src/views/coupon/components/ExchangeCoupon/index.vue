<script lang="ts">
export default {
  name: 'ExchangeCoupon',
};
</script>

<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import API_DISCOUNTS from '@/apis/discounts';

defineProps({
  show: { type: Boolean },
});

const emit = defineEmits(['update:show', 'success']);

const popupStyle = {
  width: '80%',
  'border-radius': '4px',
};
const code = ref('');
const submitted = computed(() => unref(code).length);

function onSubmit() {
  if (!unref(code)) {
    showToast('请输入口令');
    return;
  }

  const params = {
    pwd: unref(code),
  };

  showLoadingToast({
    forbidClick: true,
    message: '加载中...',
    duration: 0,
  });

  API_DISCOUNTS.discountsFetch(params)
    .then(() => {
      closeToast();
      showToast({
        message: '兑换成功',
        duration: 2000,
      });
      emit('success');
    })
    .catch((err) => {
      console.error(err);
      closeToast();
      if (Number(err.code) === 700) {
        showToast({
          message: '口令无效',
          duration: 2000,
        });
      } else {
        showToast({
          message: err.msg,
          duration: 2000,
        });
      }
    });
}

function open() {
  updateShow(true);
}
function close() {
  updateShow(false);
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
  <van-popup :show="show" position="center" :style="popupStyle" @update:show="updateShow">
    <div class="exchange-popup-close" @click="close">
      <van-icon class="exchange-popup-close-icon" name="cross" />
    </div>
    <div class="exchange-header van-hairline--bottom">兑换优惠口令</div>
    <div class="exchange-body">
      <van-field
        v-model="code"
        clearable
        :border="false"
        placeholder="请输入口令（例如v-shop，2022）"
        class="exchange-field"
        type="text"
      >
      </van-field>
      <div
        :class="['van-haptics-feedback', 'exchange-btn', submitted ? 'active' : 'gray']"
        type="primary"
        @click="onSubmit"
      >
        兑换
      </div>
    </div>
  </van-popup>
  <AffixBar size="medium" text="兑换优惠口令" @click-btn="open" />
</template>

<style lang="less" scoped>
.exchange {
  &-popup {
    width: 80%;
    border-radius: @border-radius;

    &-close {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: var(--color-text-3);
      z-index: 20;
    }
  }

  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    color: var(--color-text-1);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    padding: 10px 15px;
  }

  &-field {
    padding: 10px 10px;
    color: var(--color-text-3);
    background-color: var(--color-bg-1);
  }

  &-btn {
    width: 150px;
    height: 36px;
    margin: 20px auto 0;
    line-height: 36px;
    font-size: 12px;
    color: var(--color-text-3);
    text-align: center;
    border-radius: 18px;
    background-color: var(--color-border-1);

    &.active {
      background-color: var(--color-primary);
      color: var(--color-bg-2);
    }
  }
}
</style>
