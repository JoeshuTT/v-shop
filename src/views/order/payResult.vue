<script lang="ts">
export default {
  name: 'OrderPayResult',
};
</script>

<script setup lang="ts">
import API_ORDER from '@/apis/order';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconPaySuccess from '@/components/icons/IconPaySuccess.vue';
import IconPayFail from '@/components/icons/IconPayFail.vue';
import { decimalFormat } from '@/utils/format';

onMounted(() => {
  getDetail();
});

const router = useRouter();
const route = useRoute();

const orderInfo = ref<Recordable>({});

function goOrder() {
  router.replace({
    path: '/mine',
  });
}

function goHome() {
  router.replace({
    path: '/',
  });
}

function getDetail() {
  API_ORDER.orderDetail({ orderNumber: route.query.orderNumber })
    .then((res) => {
      orderInfo.value = res.data?.orderInfo ?? {};
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<template>
  <div class="container container-full">
    <div class="result" v-if="orderInfo.orderNumber">
      <div class="result-hd">
        <div class="result-icon">
          <template v-if="orderInfo.isPay">
            <IconPaySuccess class="result-icon-svg" />
          </template>
          <template v-else>
            <IconPayFail class="result-icon-svg" />
          </template>
        </div>
        <div class="result-status">
          <div class="result-title">{{ orderInfo.isPay ? '支付成功' : '支付失败' }}</div>
          <div class="result-title-sub">{{ orderInfo.isPay ? '感谢您的支持' : '再试试支付吧' }}</div>
        </div>
      </div>
      <div class="result-bd" v-if="orderInfo.amountReal">
        <div class="result-merchant">付款给商家</div>
        <div class="result-amount">
          <span class="result-amount-unit">¥</span>
          <span class="result-amount-value"> {{ decimalFormat(orderInfo.amountReal) }}</span>
        </div>
      </div>
      <div class="result-action">
        <van-button class="result-action-btn" @click="goOrder">查看订单</van-button>
        <van-button class="result-action-btn" plain @click="goHome">返回首页</van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 10vh 20px 0;
  background: var(--color-bg-2);
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-hd {
    display: flex;
    justify-content: center;
    margin-bottom: 10vh;
  }

  &-bd {
    margin-left: 10px;
  }

  &-icon {
    color: var(--color-primary);
    margin-right: 10px;

    &-svg {
      width: 42px;
      fill: currentColor;
    }
  }

  &-title {
    text-align: center;
    height: 25px;
    font-size: 22px;
    font-weight: bold;
    color: var(--color-text-1);
    line-height: 25px;
    font-weight: bold;
    margin-bottom: 4px;
    letter-spacing: 2px;
  }

  &-title-sub {
    font-size: 12px;
    color: var(--color-text-3);
  }

  &-merchant {
    color: var(--color-text-2);
    font-size: 16px;
    margin-bottom: 10px;
  }

  &-amount {
    margin-bottom: 30vh;

    &-unit {
      font-weight: bold;
      font-size: 18px;
      margin-right: 4px;
    }

    &-value {
      font-weight: bold;
      font-size: 30px;
      font-family: DINAlternate-Bold, DINAlternate;
    }
  }

  &-action {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-btn {
      width: 150px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      border-radius: 20px;
      background: none;
    }

    &-btn:first-child {
      color: #fff;
      background: var(--color-primary);
      margin-bottom: 35px;
    }
  }
}
</style>
