<script setup lang="ts">
import type { PropType } from 'vue';
import { ref, unref } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import API_ORDER from '@/apis/order';
import { reputation2Rate } from '@/model/modules/good/reputation';

import { usePage } from '@/hooks/shared/usePage';

const props = defineProps({
  show: { type: Boolean },
  goods: { type: Array as PropType<Recordable[]>, default: () => [] },
  orderInfo: { type: Object as PropType<Recordable>, default: () => {} },
});

const emit = defineEmits(['update:show', 'success']);

const { token } = usePage();

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'font-size': '14px',
};
const rateValue = ref(5);
const rateRemark = ref('');

function onSubmit() {
  const reputations = props.goods.map((item: Recordable) => ({
    id: item.id,
    reputation: reputation2Rate(unref(rateValue)), // 0 差评 1 中评 2 好评
    remark: unref(rateRemark), // 评价备注，限200字符
  }));

  const params = {
    token: unref(token),
    orderId: props.orderInfo.id,
    reputations,
  };

  showLoadingToast({
    overlay: true,
    message: '加载中...',
    duration: 0,
  });

  API_ORDER.orderReputation({ postJsonString: JSON.stringify(params) })
    .then(() => {
      closeToast();
      showToast({ message: '评价成功!', duration: 1500 });
      close();
      emit('success');
    })
    .catch((err) => {
      console.error(err);
    });
}

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
    <div class="rate-header">发表评价</div>
    <div class="rate-body">
      <van-cell title="请选择您的评分" :border="false"></van-cell>
      <div class="rate-box">
        <van-rate v-model="rateValue" :size="24" :gutter="8" />
      </div>
      <van-field
        v-model="rateRemark"
        :border="false"
        label="备注"
        type="textarea"
        placeholder="非常愉快的一次购物！"
        maxlength="200"
        rows="1"
        autosize
      />
    </div>
    <div class="rate-actions">
      <van-button type="primary" round block @click="onSubmit">提交评价</van-button>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.rate {
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

  &-bottom {
    width: 100%;
  }

  &-box {
    padding: 0px 15px;
    margin-bottom: 10px;
  }

  &-actions {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}
</style>
