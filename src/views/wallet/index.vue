<script setup lang="ts">
import { gsap } from 'gsap';
import { useRouter } from 'vue-router';
import { onMounted, ref, unref } from 'vue';
import { countPair } from '@/utils/format';
import API_USER from '@/apis/user';

const router = useRouter();

const detailInfo = ref<Recordable>({ balance: 0, freeze: 0, consumed: 0 });

onMounted(() => {
  getDetail();
});

function onCellClicked() {
  router.push({ path: '/wallet/cashLog' });
}

function getDetail() {
  API_USER.userAmount().then((res) => {
    gsap.to(unref(detailInfo), { duration: 0.5, balance: Number(res.data.balance) });
    detailInfo.value.freeze = res.data.freeze;
    detailInfo.value.consumed = res.data.totleConsumed;
  });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-bg"></div>
      <div class="header-hd">钱包余额(元)</div>
      <div class="amount">
        <div class="amount-item">
          <div class="amount-item-label">可用余额</div>
          <div class="amount-item-value">{{ countPair(detailInfo.balance) }}</div>
        </div>
        <div class="amount-item">
          <div class="amount-item-label">冻结余额</div>
          <div class="amount-item-value">{{ countPair(detailInfo.freeze) }}</div>
        </div>
        <div class="amount-item">
          <div class="amount-item-label">累计消费</div>
          <div class="amount-item-value">{{ countPair(detailInfo.totleConsumed) }}</div>
        </div>
      </div>
    </div>
    <van-cell title="资金记录" class="cell" is-link @click="onCellClicked">
      <template #icon>
        <van-icon name="cash-back-record" class="cell-icon" />
      </template>
    </van-cell>
  </div>
</template>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  padding: 0 15px;
}

.header {
  box-sizing: border-box;
  position: relative;
  height: 150px;
  margin: 10px 0;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 8px;
  background: linear-gradient(30deg, rgb(242, 195, 121) 0%, rgb(226, 168, 80) 100%);
  font-size: 14px;
  color: #fff;

  &-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(@/assets/images/cd2927863946844a21b8684a0c356b3f.png) center center / cover no-repeat;
  }
  &-hd {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}

.amount {
  display: flex;
  justify-content: space-around;

  &-item {
    text-align: center;

    &-label {
      margin-bottom: 10px;
    }
  }
}

.cell {
  border-radius: 8px;

  &-icon {
    display: flex;
    align-items: center;
    margin-right: 5px;
    font-size: 20px;
    color: #f6cd47;
  }
}
</style>
