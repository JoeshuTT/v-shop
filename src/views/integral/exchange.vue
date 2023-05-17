<script setup lang="ts">
import { onMounted, ref, unref } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import API_USER from '@/apis/user';
import API_SCORE from '@/apis/score';
import { scoreDeductionRuleModel } from '@/model/modules/score/deductionRule';
import { countPair } from '@/utils/format';

onMounted(() => {
  getDetail();
});

const type = ref(2);
const scoreNumber = ref('');
const detail = ref<Recordable>({});
const rule = ref<Recordable>({});

function getDetail() {
  API_USER.userAmount().then((res) => {
    detail.value = res.data || {};
  });

  API_SCORE.scoreDeductionRules({ type: unref(type) }).then((res) => {
    if (res.data?.length) {
      rule.value = scoreDeductionRuleModel(res.data[0]);
    }
  });
}

function onSubmit() {
  if (unref(type) === 2 && !unref(scoreNumber)) {
    showToast('请输入积分');
    return;
  }

  const params = {
    type: unref(type),
    deductionScore: unref(scoreNumber),
  };

  showLoadingToast({
    forbidClick: true,
    message: '加载中...',
    duration: 0,
  });

  API_SCORE.scoreExchangeCash(params)
    .then(() => {
      closeToast();
      showToast('兑换成功');
      getDetail();
    })
    .catch((err) => {
      console.error(err);
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
    </div>
    <van-field v-model="scoreNumber" type="digit" label="兑换现金" placeholder="你希望用多少积分来兑换余额" />
    <div v-if="rule.desc" class="tips">规则：{{ rule.desc }}</div>

    <!-- 立即兑换 -->
    <AffixBar size="medium" text="立即兑换" @click-btn="onSubmit" />
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 80px;
  background-image: linear-gradient(90deg, #6b6c85, #3a4053);
  color: #fff;
  text-align: center;
  font-size: 18px;
  overflow: hidden;
  margin-bottom: 20px;

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
}

.tips {
  padding: 10px 15px;
  font-size: 12px;
  color: var(--color-text-3);
}
</style>
