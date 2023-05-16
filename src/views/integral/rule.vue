<script setup lang="ts">
import { onMounted, ref } from 'vue';
import API_SCORE from '@/apis/score';
import { scoreDeductionRuleModel } from '@/model/modules/score/deductionRule';

onMounted(() => {
  getDetail();
});

const list = ref<Recordable[]>([]);

function getDetail() {
  API_SCORE.scoreDeductionRules().then((res) => {
    if (res.data?.length) {
      list.value = res.data.map((v: Recordable) => scoreDeductionRuleModel(v));
    }
  });
}
</script>

<template>
  <div class="container container-full">
    <div class="header">积分规则</div>
    <div class="content">
      <div class="section">
        <div class="section-h2">积分该怎么花？</div>
        <div class="section-body">
          <div v-if="list.length" class="consume">
            <div class="consume-header"><span>使用积分兑换商品</span></div>
            <div class="consume-list">
              <div v-for="item in list" :key="item.type" class="consume-list-item">
                <img :src="item.icon" class="consume-list-item-icon" />
                <div class="consume-list-item-content">
                  <div class="consume-list-item-title">{{ item.label }}</div>
                  <div class="consume-list-item-desc">{{ item.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section-h2">常见问题</div>
        <div class="section-body">
          <div class="help">
            <div class="help-list">
              <div class="help-list-item">
                <div class="help-list-item-title">1. 积分状态</div>
                <div class="help-list-item-content">
                  <p>积分分为收入，支出2个状态。</p>
                  <p>收入：指的是通过所有渠道获得的积分</p>
                  <p>支出：指的是消耗的积分</p>
                </div>
              </div>
              <div class="help-list-item">
                <div class="help-list-item-title">2. 积分有效期</div>
                <div class="help-list-item-content">永久有效</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  background-image: linear-gradient(90deg, #6b6c85, #3a4053);
  color: #fff;
  text-align: center;
  font-size: 18px;
  overflow: hidden;
  margin-bottom: 20px;
}

.section {
  &-h2 {
    display: inline-block;
    background-image: linear-gradient(-54deg, #3a4053 1%, #6b6c85);
    border-radius: 0 15px 15px 0;
    padding: 0 20px;
    margin-left: -1px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }

  &-body {
    padding: 20px;
  }
}

.consume {
  &-header {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #64667e;

    &::before {
      margin-right: 10px;
      content: '';
      width: 3px;
      height: 16px;
      background-color: #64667e;
    }
  }

  &-list {
    padding: 16px 16px 7px;

    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 12px;

      &-icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }

      &-title {
        font-size: 14px;
        color: var(--color-text-1);
        margin-bottom: 4px;
      }

      &-desc {
        color: var(--color-text-3);
      }
    }
  }
}

.help {
  &-list {
    &-item {
      &-title {
        font-size: 16px;
        font-weight: bold;
        color: #64667e;
        margin-bottom: 10px;
      }

      &-content {
        margin-bottom: 20px;
        padding-left: 16px;
        font-size: 14px;
        color: var(--color-text-1);
        line-height: 24px;
      }

      p {
        margin: 0;
      }
    }
  }
}
</style>
