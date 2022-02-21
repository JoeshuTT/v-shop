<template>
  <van-popup
    :value="value"
    round
    closeable
    position="bottom"
    class="sku-popup"
    @click-close-icon="onClose"
    @click-overlay="onClose"
  >
    <div v-if="sku.goodInfo" class="sku-header van-hairline--bottom">
      <van-image class="sku-header-pic" :src="sku.goodInfo.pic" fit="cover" />
      <div class="sku-header-good-info">
        <div class="sku-header-good-name van-multi-ellipsis--l2">{{ sku.goodInfo.name }}</div>
        <div class="sku-header-good-info-bd">
          <div class="sku-header-good-price">
            <span class="sku-header-good-price-symbol">¥</span>
            <span class="sku-header-good-price-integer">
              {{ selectedSkuComb.price | priceIntegerFormat(selectedSkuComb.maxPrice) }}
            </span>
          </div>
          <div class="sku-header-item">
            剩余 <span class="sku-header-good-stock-num">{{ selectedSkuComb.stock }}</span>
            {{ sku.goodInfo.unit || '件' }}
          </div>
          <div v-if="selectedPropTitle" class="sku-header-item">{{ selectedPropTitle }}</div>
        </div>
      </div>
    </div>
    <div class="sku-body">
      <div v-for="(item, index) in sku.propList" :key="item.id" class="sku-group van-hairline--bottom">
        <div class="sku-group-hd">
          {{ item.name }}
        </div>
        <div v-if="item.childsCurGoods && item.childsCurGoods.length" class="sku-group-list">
          <div
            v-for="(v, i) in item.childsCurGoods"
            :key="v.id"
            :class="['sku-group-list-item', initialSku.selectedProps[item.id] === v.id ? 'active' : '']"
            @click="onPropClicked(index, i)"
          >
            <span class="sku-group-list-item-name">{{ v.name }}</span>
          </div>
        </div>
      </div>
      <div class="sku-num">
        <div class="sku-num-title">购买数量</div>
        <van-stepper v-model="initialSku.selectedNum" class="sku-num-stepper" />
      </div>
    </div>
    <div class="sku-actions">
      <van-button type="primary" round block @click="onSubmit">确定</van-button>
    </div>
  </van-popup>
</template>

<script>
import { decimalFormat, priceIntegerFormat } from '@/utils/format';

export default {
  filters: {
    decimalFormat,
    priceIntegerFormat,
  },
  props: {
    value: Boolean,
    sku: Object,
    initialSku: Object,
  },
  computed: {
    /**
     * 是否多规格
     */
    hasSku() {
      return !!this.sku.skuList.length;
    },
    skuValue() {
      if (this.hasSku) {
        const { skuList } = this.sku;
        let propertyChildIds = ``;
        Object.keys(this.initialSku.selectedProps).forEach((key) => {
          propertyChildIds += `${key}:${this.initialSku.selectedProps[key]},`;
        });

        return skuList.find((v) => v.propertyChildIds === propertyChildIds);
      }

      return undefined;
    },
    selectedPropTitle() {
      if (this.hasSku) {
        const { propList } = this.sku;
        const { selectedPropList } = this.initialSku;

        return this.skuValue
          ? `已选 ${selectedPropList.reduce((acc, cur) => `${acc} ${cur.childName}`, '')}`
          : `请选择 ${propList.reduce(
              (acc, cur) => `${acc}${selectedPropList.some((v) => v.id === cur.id) ? '' : cur.name}`,
              '',
            )}`;
      } else {
        return '';
      }
    },
    selectedSkuComb() {
      if (this.hasSku) {
        if (this.skuValue) {
          return {
            price: this.skuValue.price,
            maxPrice: this.skuValue.price,
            stock: this.skuValue.stores,
          };
        } else {
          const { skuList } = this.sku;

          return {
            price: skuList[0].price,
            maxPrice: skuList[skuList.length - 1].price,
            stock: this.sku.stock,
          };
        }
      } else {
        return {
          price: this.sku.price,
          maxPrice: this.sku.price,
          stock: this.sku.stock,
        };
      }
    },
  },
  methods: {
    onClose() {
      this.$emit('input', false);
    },
    onOpen() {
      this.$emit('input', true);
    },
    onPropClicked(index, i) {
      const item = this.sku.propList[index];
      const v = item.childsCurGoods[i];

      if (this.initialSku.selectedProps[item.id] === v.id) {
        this.$set(this.initialSku.selectedProps, item.id, 0);
      } else {
        this.$set(this.initialSku.selectedProps, item.id, v.id);
      }

      const selectedPropList = [];

      this.sku.propList.forEach((item) => {
        item.childsCurGoods.forEach((v) => {
          this.initialSku.selectedProps[item.id] === v.id &&
            selectedPropList.push({
              id: item.id,
              name: item.name,
              childId: v.id,
              childName: v.name,
              propIds: `${item.id}:${v.id}`,
            });
        });
      });

      this.initialSku.selectedPropList = selectedPropList;
    },
    onSubmit() {
      if (this.initialSku.selectedNum > this.selectedSkuComb.stock) {
        this.$toast({
          message: '库存不足',
          duration: 1500,
        });
        return;
      }

      if (this.hasSku && !this.skuValue) {
        this.$toast({
          message: '请选择商品规格',
          duration: 1500,
        });
        return;
      }

      const data = {
        goodsId: this.sku.goodInfo.id,
        selectedSkuComb: this.selectedSkuComb,
      };

      this.$emit('confirm', data);
    },
  },
};
</script>

<style lang="less" scoped>
.sku {
  &-popup {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    max-height: 80%;
    min-height: 50%;
    overflow-y: visible;
    font-size: 14px;
    background: #fff;
  }

  &-header {
    margin: 0 15px;
    display: flex;

    &-pic {
      width: 96px;
      height: 96px;
      margin: 10px 10px 10px 0;
      overflow: hidden;
      border-radius: 4px;
    }

    &-good-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 10px 20px 10px 0;
    }

    &-good-name {
      margin-bottom: 5px;
      flex: 1;
    }

    &-good-price {
      margin-left: -2px;
      color: var(--brand-color);
      line-height: 1.15;

      &-symbol {
        margin-right: 2px;
        line-height: 18px;
      }

      &-integer {
        font-weight: bold;
        font-size: 22px;
        font-family: @font-family-price-integer;
      }
    }

    &-item {
      margin-top: 5px;
      color: var(--gray-color-6);
      font-size: 12px;
      line-height: 16px;
    }
  }

  &-body {
    flex: 1 1 auto;
    min-height: 44px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  &-group {
    padding-top: 10px;
    margin: 0 15px 10px;
    font-size: 14px;
    color: var(--gray-color-8);

    &-hd {
      padding-bottom: 12px;
      font-size: 16px;
    }
    &-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      &-item {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        margin: 0 10px 10px 0;
        font-size: 12px;
        line-height: 16px;
        overflow: hidden;
        color: var(--gray-color-8);
        border-radius: 4px;

        &::before {
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--gray-color-1);
        }

        &-name {
          padding: 8px;
          z-index: 1;
        }

        &.active {
          color: var(--brand-color);
        }

        &.active::before {
          background: currentColor;
          opacity: 0.1;
        }
      }
    }
  }

  &-num {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    overflow: hidden;
    line-height: 30px;

    overflow: hidden;
  }

  &-actions {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}
</style>
