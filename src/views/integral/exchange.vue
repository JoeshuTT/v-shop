<template>
  <div class="container">
    <div class="header">
      <div class="header-count">
        <span class="header-count-value">{{ detail.score | countPair(0) }}</span>
        <span class="header-count-label">可用积分</span>
      </div>
    </div>
    <van-field v-model="scoreNumber" type="digit" label="兑换现金" placeholder="你希望用多少积分来兑换余额" />
    <div v-if="rule.desc" class="tips">规则：{{ rule.desc }}</div>
    <!-- 完成 -->
    <AffixBarAction button-text="立即兑换" @submit="onSubmit" />
  </div>
</template>

<script>
import AffixBarAction from '@/components/AffixBarAction';
import API_USER from '@/apis/user';
import { countPair } from '@/utils/format';
import API_SCORE from '@/apis/score';
import { scoreDeductionRuleModel } from '@/model/modules/score/deductionRule';

export default {
  components: { AffixBarAction },
  filters: {
    countPair,
  },
  data() {
    return {
      type: 2,
      scoreNumber: '',
      detail: {},
      rule: {},
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      API_USER.userAmount().then((res) => {
        this.detail = res.data || {};
      });

      API_SCORE.scoreDeductionRules({ type: this.type }).then((res) => {
        if (res.data?.length) {
          this.rule = scoreDeductionRuleModel(res.data[0]);
        }
      });
    },
    onSubmit() {
      if (this.type === 2 && !this.scoreNumber) {
        this.$toast('请输入积分');
        return;
      }

      const params = {
        type: this.type,
        deductionScore: this.scoreNumber,
      };

      this.$toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      API_SCORE.scoreExchangeCash(params)
        .then(() => {
          this.$toast('兑换成功');
          this.getDetail();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

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
  color: var(--gray-color-6);
}
</style>
