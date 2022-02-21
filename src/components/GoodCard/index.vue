<template>
  <div class="good-card">
    <van-image fit="contain" class="good-card-pic" :src="good.pic" />
    <div class="good-card-content">
      <div class="good-card-title">{{ good.name }}</div>
      <div class="good-card-desc">
        <div v-if="good.propertyList && good.propertyList.length" class="good-card-prop">
          {{ good.propertyList | propTitle }}
        </div>
      </div>
      <div class="good-card-bottom">
        <div class="good-card-price">
          <span class="good-card-price-symbol">¥</span>
          <span class="good-card-price-integer">{{ good.price | decimalFormat }}</span>
        </div>
        <div class="good-card-number">x{{ good.number }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { decimalFormat } from '@/utils/format';

export default {
  filters: {
    decimalFormat,
    propTitle(list) {
      return list.map((v) => v.childName).join(',');
    },
  },
  props: {
    good: Object,
  },
};
</script>

<style lang="less" scoped>
.good {
  &-card {
    position: relative;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    align-items: center;

    &-selected {
      margin-left: -10px;
      min-width: 40px;
      display: flex;
      justify-content: center;
    }

    &-pic {
      width: 90px;
      height: 90px;
      border-radius: 8px;
      margin-right: 10px;
      overflow: hidden;
    }

    &-content {
      min-width: 0;
      min-height: 90px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-title {
      font-size: 14px;
      line-height: 16px;
      color: var(--gray-color-8);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-desc {
      flex: 1;
      font-size: 12px;
      line-height: 20px;
      color: var(--gray-color-6);
    }

    &-price {
      color: var(--gray-color-8);
      &-symbol {
        font-size: 12px;
        margin-right: 2px;
      }

      &-integer {
        font-size: 18px;
        font-family: @font-family-price-integer;
      }
    }

    &-bottom {
      font-size: 12px;
      color: var(--gray-color-6);
    }
  }
}
</style>
