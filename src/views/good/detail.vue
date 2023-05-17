<script lang="ts">
export default {
  name: 'GoodDetail',
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';
import API_GOODS from '@/apis/goods';
import API_CART from '@/apis/cart';
import { shoppingCartAddParams } from '@/apis/cart/types';
import { ISku, IInitialSku } from '@/components/Sku/types';
import Coupons from './components/Coupons.vue';
import Reputations from './components/Reputations.vue';
import { decimalFormat, priceIntegerFormat } from '@/utils/format';
import { debounce } from '@/utils';
import { getAfterSaleTitle } from '@/model/modules/order/afterSale';

import { useOrderStore } from '@/store/modules/order';
import { usePage } from '@/hooks/shared/usePage';

onMounted(() => {
  getGoodsDetail();

  if (unref(hasLogin)) {
    getCartCount();
  }
});

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const { hasLogin } = usePage();

const picList = ref<Recordable[]>([]);
const basicInfo = ref<Recordable>({});
const logistics = ref<Recordable>({});
const content = ref('');
const goodPrice = computed(() => {
  if (unref(hasSku)) {
    return unref(sku).skuList[0].price;
  } else {
    return unref(basicInfo).minPrice;
  }
});
const goodMaxPrice = computed(() => {
  if (unref(hasSku)) {
    return unref(sku).skuList[unref(sku).skuList.length - 1].price;
  } else {
    return '';
  }
});

const goodDeliveryTitle = computed(() => {
  if (unref(basicInfo).logisticsId) {
    return `运费 ${unref(logistics).isFree ? '包邮' : '不包邮'}`;
  } else {
    return `无需配送`;
  }
});

function getGoodsDetail() {
  API_GOODS.goodsDetail({ id: route.query.id }).then((res) => {
    picList.value = res.data.pics;
    basicInfo.value = res.data.basicInfo;
    logistics.value = res.data?.logistics ?? {};
    content.value = res.data.content;

    // 商品已下架
    if (unref(basicInfo).status === 1) {
      showToast(unref(basicInfo).statusStr);
      return;
    }
    // 商品库存为0
    if (unref(basicInfo).stores === 0) {
      showConfirmDialog({
        title: '提示',
        message: '该商品已售罄,去看看其他商品吧！',
        showCancelButton: false,
      })
        .then(() => {
          // on confirm
          router.replace({ path: '/home' });
        })
        .catch(() => {
          // on cancel
        });
      return;
    }

    document.title = unref(basicInfo).name;

    getSkuData(res.data.basicInfo, res.data?.properties ?? [], res.data?.skuList ?? []);
    getAfterService();
    // TODO 商品收藏
  });
}

// Sku
const skuNextActionType = ref('goBuy');
const skuShow = ref(false);
const sku = ref<ISku>({
  goodsId: 0,
  price: 0,
  stock: 0,
  goodInfo: {},
  propList: [],
  skuList: [],
});
const initialSku = ref<IInitialSku>({
  selectedNum: 1,
  selectedProps: {},
  selectedPropList: [],
});

/**
 * 是否多规格
 */
const hasSku = computed(() => !!unref(sku).skuList.length);

const goodSelectedSkuTitle = computed(() => {
  if (unref(hasSku)) {
    if (unref(initialSku).selectedPropList.length) {
      return unref(initialSku).selectedPropList.reduce((acc, cur) => `${acc} ${cur.childName}`, '');
    } else {
      return unref(sku).propList.reduce((acc, cur) => `${acc} ${cur.name}`, '');
    }
  } else {
    return '';
  }
});

function onSkuShow(type: string) {
  skuNextActionType.value = type;
  skuShow.value = true;
}

const onSkuConfirm = debounce((data) => {
  skuShow.value = false;
  if (unref(skuNextActionType) === 'addCart') {
    addCartHandle();
  } else {
    orderStore.setTradeGoods({
      origin: 'buy',
      list: [
        {
          goodsId: unref(sku).goodsId,
          name: unref(sku).goodInfo.name,
          number: unref(initialSku).selectedNum,
          pic: unref(sku).goodInfo.pic,
          price: data.selectedSkuComb.price,
          logisticsId: unref(basicInfo).logisticsId,
          propertyList: unref(initialSku).selectedPropList,
        },
      ],
    });
  }
}, 1500);

function getSkuData(basicInfo: Recordable, properties: Recordable[], skuList: Recordable[]) {
  sku.value = {
    goodsId: basicInfo.id,
    stock: basicInfo.stores,
    price: basicInfo.minPrice,
    goodInfo: {
      id: basicInfo.id,
      pic: basicInfo.pic,
      name: basicInfo.name,
      unit: basicInfo.unit,
    },
    propList: properties,
    skuList: skuList.sort((a, b) => a.price - b.price), // 按照商品价格从低到高排序
  };
}

function onConcatService() {
  showToast('未开放：客服');
}

// 售后服务
const afterSaleTitle = ref('');
function getAfterService() {
  afterSaleTitle.value = getAfterSaleTitle(unref(basicInfo).afterSale);
}

// 购物车
const cartCount = ref<number | undefined>(undefined);
function getCartCount() {
  API_CART.shoppingCartInfo().then((res) => {
    cartCount.value = res.data?.number as number;
  });
}

function addCartHandle() {
  const params: shoppingCartAddParams = {
    goodsId: unref(sku).goodsId,
    number: unref(initialSku).selectedNum,
  };

  if (unref(initialSku).selectedPropList.length) {
    params.sku = JSON.stringify(
      unref(initialSku).selectedPropList.map((v: Recordable) => ({
        optionId: v.id,
        optionValueId: v.childId,
      })),
    );
  }

  API_CART.shoppingCartAdd(params)
    .then(() => {
      showToast('已成功加入购物车');
      getCartCount();
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<template>
  <div class="container">
    <van-swipe :autoplay="3000" class="swiper">
      <van-swipe-item v-for="item in picList" :key="item.id" class="swiper-item">
        <van-image class="swiper-item-img" fit="contain" :src="item.pic" alt="" />
      </van-swipe-item>
    </van-swipe>
    <div class="section">
      <div class="price">
        <div class="price-hd">
          <div class="price-current">
            <span class="price-current-symbol">¥</span>
            <span class="price-current-integer">{{ priceIntegerFormat(goodPrice, goodMaxPrice) }}</span>
            <!-- <span v-if="marketing.type" class="price-tag">{{ marketing.info.label }}</span> -->
          </div>
          <div v-if="basicInfo.originalPrice > 0" class="price-origin">
            <span class="price-origin-label">价格</span>
            <span class="price-origin-symbol">¥</span>
            <span class="price-origin-integer">{{ decimalFormat(basicInfo.originalPrice) }}</span>
          </div>
        </div>
      </div>
      <div class="desc">
        <div class="desc-hd">
          <div class="desc-title van-multi-ellipsis--l2">{{ basicInfo.name }}</div>
          <div v-if="basicInfo.characteristic" class="desc-brief">
            {{ basicInfo.characteristic }}
          </div>
        </div>
      </div>
    </div>
    <div class="stock van-hairline--top">
      <div class="stock-item">
        {{ goodDeliveryTitle }}
      </div>
      <!-- <div class="stock-item">购买：{{ basicInfo.numberSells }}</div> -->
      <div class="stock-item">剩余 {{ basicInfo.stores }}</div>
    </div>
    <Coupons title="领券" />
    <van-cell>
      <template #title>
        <div class="cell-bar">
          <div class="cell-bar-title">服务</div>
          <div class="cell-bar-text">{{ afterSaleTitle }}</div>
        </div>
      </template>
    </van-cell>
    <van-cell v-if="hasSku" :border="false" is-link @click="onSkuShow">
      <template #title>
        <div class="cell-bar">
          <div class="cell-bar-title">{{ initialSku.selectedPropList.length ? '已选' : '选择' }}</div>
          <div class="cell-bar-text">{{ goodSelectedSkuTitle }}</div>
        </div>
      </template>
    </van-cell>
    <Reputations v-if="basicInfo.id" class="mt10" :goods-id="basicInfo.id" />
    <Plate title="商品详情" class="mt10" />
    <div class="goods-content" v-html="content"></div>
    <div class="action-bar-perch"></div>
    <!-- 商品导航栏 -->
    <van-action-bar>
      <van-action-bar-icon icon="thumb-circle-o" text="首页" to="/home" replace />
      <van-action-bar-icon icon="chat-o" text="客服" @click="onConcatService" />
      <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" :badge="cartCount" replace />
      <van-action-bar-button type="warning" text="加入购物车" @click="onSkuShow('addCart')" />
      <van-action-bar-button type="danger" text="立即购买" @click="onSkuShow" />
    </van-action-bar>
    <!-- SKU 弹窗 -->
    <Sku v-model:show="skuShow" :sku="sku" :initial-sku="initialSku" @confirm="onSkuConfirm" />
  </div>
</template>

<style lang="less" scoped>
.section {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px;
  background: var(--color-bg-2);
}

.swiper {
  width: 100%;
  height: 375px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

.price {
  margin-top: 10px;

  &-current {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 16px;
    color: var(--color-primary);

    &-symbol {
      font-size: 14px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 22px;
      font-weight: bold;
      font-family: @font-family-price-integer;
    }
  }

  &-origin {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 12px;
    line-height: 18px;
    color: var(--color-text-3);

    &-label {
      margin-right: 4px;
    }

    &-integer {
      text-decoration: line-through;
      font-family: @font-family-price-integer;
    }
  }

  &-tag {
    box-sizing: border-box;
    margin-left: 10px;
    display: inline-flex;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 4px;
    color: #f44;
    border: 1px solid #f44;
  }
}

.desc {
  margin-top: 10px;

  &-title {
    font-size: 16px;
    line-height: 20px;
  }

  &-brief {
    margin-top: 4px;
    color: var(--color-text-3);
    font-size: 12px;
    word-break: break-all;
  }
}

.stock {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: var(--color-bg-2);
  margin-bottom: 10px;

  &-item {
    flex: 1;
    font-size: 12px;
    color: var(--color-text-3);

    &:last-child {
      text-align: right;
    }
  }
}

.goods-content {
  box-sizing: border-box;
  background: var(--color-bg-2);
  padding: 0 10px;
  padding-top: 10px;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  word-wrap: break-word;

  :deep(i)mg {
    display: block;
    max-width: 100% !important;
    height: auto !important;
  }

  :deep(p) {
    margin: 0;
    padding: 0;
  }
}

.mb10 {
  margin-bottom: 10px;
}

.mt10 {
  margin-top: 10px;
}

.cell-bar {
  display: flex;
  color: var(--color-text-1);

  &-title {
    flex-shrink: 0;
    margin-right: 12px;
    color: var(--color-text-3);
  }

  &-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}

.action-bar-perch {
  height: calc(50px + var(--safe-area-height-bottom));
}
</style>
