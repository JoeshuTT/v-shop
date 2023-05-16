<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { showToast } from 'vant';
import API_USER from '@/apis/user';
import { countPair } from '@/utils/format';

import { usePage } from '@/hooks/shared/usePage';

onMounted(() => {
  getDetail();
});

const { goPage } = usePage();

const detail = ref<Recordable>({});

function onCellClicked() {
  showToast('未开放：签到送积分');
}

function getDetail() {
  API_USER.userAmount().then((res) => {
    detail.value = res.data || {};
  });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-count">
        <span class="header-count-value">{{ countPair(detail.score, 0) }}</span>
        <span class="header-count-label">可用积分</span>
      </div>
      <div class="header-tag" @click="goPage('/integral/rule')">积分规则</div>
    </div>
    <van-cell title="交易记录" class="cell" is-link @click="goPage('/integral/scoreLog')">
      <template #icon>
        <van-icon name="cash-back-record" class="cell-icon" color="#f6cd47" />
      </template>
    </van-cell>
    <van-cell title="积分兑换" class="cell" is-link @click="goPage('/integral/exchange')">
      <template #icon>
        <van-icon name="point-gift-o" class="cell-icon" color="#42a4ff" />
      </template>
    </van-cell>
    <van-cell title="签到赠送积分" class="cell" is-link @click="onCellClicked">
      <template #icon>
        <van-icon name="calendar-o" class="cell-icon" color="#42a4ff" />
      </template>
    </van-cell>
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  width: 100%;
  height: 80px;
  background-image: linear-gradient(90deg, #6b6c85, #3a4053);
  color: #fff;
  font-size: 12px;
  overflow: hidden;
  margin-bottom: 10px;

  &-count {
    display: flex;
    align-items: center;

    &-value {
      font-size: 24px;
      font-weight: 500;
    }

    &-label {
      margin-left: 8px;
      font-size: 12px;
    }
  }

  &-tag {
    width: 64px;
    height: 24px;
    line-height: 24px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    font-size: 12px;
    color: #fff;
    box-sizing: border-box;
    text-align: center;
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
  }
}
</style>
