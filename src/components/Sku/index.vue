<script lang="ts">
export default {
  name: 'Sku',
};
</script>
<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, unref } from 'vue';
import { IInitialSku, ISku, ISelectedSkuComb, ISelectedPropItem } from './types';
import { priceIntegerFormat } from '@/utils/format';
import { showToast } from 'vant';

const props = defineProps({
  show: { type: Boolean, default: false },
  sku: { type: Object as PropType<ISku>, default: () => ({}) },
  initialSku: { type: Object as PropType<IInitialSku>, default: () => ({}) },
});

const emit = defineEmits(['update:show', 'confirm']);

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'max-height': '80%',
  'min-height': '50%',
  'overflow-y': 'visible',
  'font-size': '14px',
};

/**
 * 是否多规格
 */
const hasSku = computed(() => !!props.sku.skuList.length);

const skuValue = computed((): Recordable | undefined => {
  if (unref(hasSku)) {
    const { skuList } = props.sku;
    let propertyChildIds = ``;
    Object.keys(props.initialSku.selectedProps).forEach((key) => {
      propertyChildIds += `${key}:${props.initialSku.selectedProps[key]},`;
    });

    return skuList.find((v) => v.propertyChildIds === propertyChildIds);
  }

  return undefined;
});

const selectedPropTitle = computed(() => {
  if (unref(hasSku)) {
    const { propList } = props.sku;
    const { selectedPropList } = props.initialSku;

    return unref(skuValue)
      ? `已选 ${selectedPropList.reduce((acc, cur) => `${acc} ${cur.childName}`, '')}`
      : `请选择 ${propList.reduce(
          (acc, cur) => `${acc}${selectedPropList.some((v) => v.id === cur.id) ? '' : cur.name}`,
          '',
        )}`;
  } else {
    return '';
  }
});

const selectedSkuComb = computed((): ISelectedSkuComb => {
  if (unref(hasSku)) {
    if (unref(skuValue)) {
      return {
        price: unref(skuValue)?.price,
        maxPrice: unref(skuValue)?.price,
        stock: unref(skuValue)?.stores,
      };
    } else {
      const { skuList } = props.sku;

      return {
        price: skuList[0].price,
        maxPrice: skuList[skuList.length - 1].price,
        stock: props.sku.stock,
      };
    }
  } else {
    return {
      price: props.sku.price,
      maxPrice: props.sku.price,
      stock: props.sku.stock,
    };
  }
});

function onPropClicked(index: number, i: number) {
  const item = props.sku.propList[index];
  const v = item.childsCurGoods[i];

  // eslint-disable-next-line vue/no-mutating-props
  props.initialSku.selectedProps[item.id] = props.initialSku.selectedProps[item.id] === v.id ? 0 : v.id;

  const selectedPropList: ISelectedPropItem[] = [];

  props.sku.propList.forEach((item) => {
    item.childsCurGoods.forEach((v: Recordable) => {
      props.initialSku.selectedProps[item.id] === v.id &&
        selectedPropList.push({
          id: item.id,
          name: item.name,
          childId: v.id,
          childName: v.name,
          propIds: `${item.id}:${v.id}`,
        });
    });
  });

  // eslint-disable-next-line vue/no-mutating-props
  props.initialSku.selectedPropList = selectedPropList;
}

function onSubmit() {
  if (props.initialSku.selectedNum > unref(selectedSkuComb).stock) {
    showToast({
      message: '库存不足',
      duration: 1500,
    });
    return;
  }

  if (unref(hasSku) && !unref(skuValue)) {
    showToast({
      message: '请选择商品规格',
      duration: 1500,
    });
    return;
  }

  const data = {
    goodsId: props.sku.goodInfo.id,
    selectedSkuComb: unref(selectedSkuComb),
  };

  emit('confirm', data);
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
    <div v-if="sku.goodInfo" class="sku-header van-hairline--bottom">
      <van-image class="sku-header-pic" :src="sku.goodInfo.pic" fit="cover" />
      <div class="sku-header-good-info">
        <div class="sku-header-good-name van-multi-ellipsis--l2">{{ sku.goodInfo.name }}</div>
        <div class="sku-header-good-info-bd">
          <div class="sku-header-good-price">
            <span class="sku-header-good-price-symbol">¥</span>
            <span class="sku-header-good-price-integer">
              {{ priceIntegerFormat(selectedSkuComb.price, selectedSkuComb.maxPrice) }}
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
        <!-- eslint-disable-next-line vue/no-mutating-props -->
        <van-stepper v-model="initialSku.selectedNum" class="sku-num-stepper" />
      </div>
    </div>
    <div class="sku-actions">
      <van-button type="primary" round block @click="onSubmit">确定</van-button>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.sku {
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
      color: var(--color-primary);
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
      color: var(--color-text-3);
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
    color: var(--color-text-1);

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
        color: var(--color-text-1);
        border-radius: 4px;

        &::before {
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--color-bg-1);
        }

        &-name {
          padding: 8px;
          z-index: 1;
        }

        &.active {
          color: var(--color-primary);
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
