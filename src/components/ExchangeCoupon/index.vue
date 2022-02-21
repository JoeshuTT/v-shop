<script lang="ts">
export default {
  name: 'ExchangeCoupon',
};
</script>

<script lang="ts" setup>
import API_DISCOUNTS from '@/apis/discounts';
import { Toast } from 'vant';
import { computed, ref, unref } from 'vue';

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

function onClose() {
  handleShowChange(false);
}

// function onOpen() {
//   handleShowChange(true);
// }

function handleShowChange(v: boolean) {
  emit('update:show', v);
}

function onSubmit() {
  if (!unref(code)) {
    Toast('请输入口令');
    return;
  }

  const params = {
    pwd: unref(code),
  };

  Toast.loading({
    forbidClick: true,
    message: '加载中...',
    duration: 0,
  });

  API_DISCOUNTS.discountsFetch(params)
    .then((res) => {
      Toast.clear();
      if (Number(res.code) === 0) {
        Toast('兑换成功');
        emit('success');
      } else {
        Toast('口令无效');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
</script>

<template>
  <van-popup :show="show" position="center" :style="popupStyle" @click-overlay="onClose">
    <div class="exchange-popup-close" @click="onClose">
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
      <div :class="['button-active', 'exchange-btn', submitted ? 'active' : 'gray']" type="primary" @click="onSubmit">
        兑换
      </div>
    </div>
  </van-popup>
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
      color: var(--gray-color-6);
      z-index: 20;
    }
  }

  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    color: var(--gray-color-8);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    padding: 10px 15px;
  }

  &-field {
    padding: 10px 10px;
    color: var(--gray-color-6);
    background-color: var(--gray-color-1);
  }

  &-btn {
    color: var(--gray-color-6);
    width: 150px;
    height: 36px;
    margin: 20px auto 0;
    line-height: 36px;
    font-size: 12px;
    text-align: center;
    border-radius: 18px;
    background-color: var(--gray-color-3);

    &.active {
      background-color: var(--brand-color);
      color: var(--white);
    }
  }
}
</style>
