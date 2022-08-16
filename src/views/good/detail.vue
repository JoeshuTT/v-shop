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
            <span class="price-current-integer">{{ goodPrice | priceIntegerFormat(goodMaxPrice) }}</span>
            <!-- <span v-if="marketing.type" class="price-tag">{{ marketing.info.label }}</span> -->
          </div>
          <div v-if="basicInfo.originalPrice > 0" class="price-origin">
            <span class="price-origin-label">价格</span>
            <span class="price-origin-symbol">¥</span>
            <span class="price-origin-integer">{{ basicInfo.originalPrice | decimalFormat }}</span>
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
    <Coupons title="领券" :list="couponList" />
    <van-cell>
      <template #title>
        <div class="cell-bar">
          <div class="cell-bar-title">服务</div>
          <div class="cell-bar-text">{{ afterSaleTitle }}</div>
        </div>
      </template>
    </van-cell>
    <van-cell v-if="hasSku" :border="false" is-link @click="onSkuShow()">
      <template #title>
        <div class="cell-bar">
          <div class="cell-bar-title">{{ initialSku.selectedPropList.length ? '已选' : '选择' }}</div>
          <div class="cell-bar-text">{{ goodSelectedSkuTitle }}</div>
        </div>
      </template>
    </van-cell>
    <Reputations class="mt10" :goods-id="basicInfo.id" :list="reputationList" :total="reputationTotal" />
    <Plate title="商品详情" class="mt10" />
    <div class="goods-content" v-html="content"></div>
    <!-- 商品导航栏 -->
    <van-goods-action>
      <van-goods-action-icon icon="thumb-circle-o" text="首页" to="/home" replace />
      <van-goods-action-icon icon="chat-o" text="客服" @click="onConcatService" />
      <van-goods-action-icon icon="cart-o" text="购物车" to="/cart" :badge="cartCount" replace />
      <van-goods-action-button type="warning" text="加入购物车" @click="onSkuShow('addCart')" />
      <van-goods-action-button type="danger" text="立即购买" @click="onSkuShow()" />
    </van-goods-action>
    <!-- SKU 弹窗 -->
    <Sku v-model="skuShow" :sku="sku" :initial-sku="initialSku" @confirm="onSkuConfirm" />
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import API_GOODS from '@/apis/goods';
import API_DISCOUNTS from '@/apis/discounts';
import API_CART from '@/apis/cart';
import Plate from '@/components/Plate';
import Sku from '@/components/Sku';
import Coupons from './components/Coupons';
import Reputations from './components/Reputations';
import { decimalFormat, priceIntegerFormat } from '@/utils/format';
import usePage from '@/mixins/usePage';
import { goodReputationModel } from '@/model/modules/good/reputation';
import { getAfterSaleTitle } from '@/model/modules/order/afterSale';
import { throttle } from '@/utils';

export default {
  components: {
    Plate,
    Coupons,
    Reputations,
    Sku,
  },
  filters: { decimalFormat, priceIntegerFormat },
  mixins: [usePage],
  data() {
    return {
      picList: [],
      basicInfo: {},
      logistics: {},
      couponList: [],
      reputationList: [],
      reputationTotal: 0,
      content: '',
      // 售后服务
      afterSaleTitle: '',
      // 购物车
      cartCount: undefined,
      // Sku
      skuNextActionType: 'goBuy',
      skuShow: false,
      sku: {
        goodsId: '',
        price: '',
        stock: '',
        goodInfo: {},
        propList: [],
        skuList: [],
      },
      initialSku: {
        selectedNum: 1,
        selectedProps: {},
        selectedPropList: [],
      },
    };
  },
  computed: {
    /**
     * 是否多规格
     */
    hasSku() {
      return !!this.sku.skuList.length;
    },
    goodPrice() {
      if (this.hasSku) {
        return this.sku.skuList[0].price;
      } else {
        return this.basicInfo.minPrice;
      }
    },
    goodMaxPrice() {
      if (this.hasSku) {
        return this.sku.skuList[this.sku.skuList.length - 1].price;
      } else {
        return '';
      }
    },
    goodSelectedSkuTitle() {
      if (this.hasSku) {
        if (this.initialSku.selectedPropList.length) {
          return this.initialSku.selectedPropList.reduce((acc, cur) => `${acc} ${cur.childName}`, '');
        } else {
          return this.sku.propList.reduce((acc, cur) => `${acc} ${cur.name}`, '');
        }
      } else {
        return '';
      }
    },
    goodDeliveryTitle() {
      if (this.basicInfo.logisticsId) {
        return `运费 ${this.logistics.isFree ? '包邮' : '不包邮'}`;
      } else {
        return `无需配送`;
      }
    },
  },
  created() {
    this.getGoodsDetail();
    this.getGoodsReputation();
    if (this.hasLogin) {
      this.getCouponList();
      this.getCartCount();
    }
  },
  methods: {
    ...mapActions({
      setTradeGoods: 'order/setTradeGoods',
    }),
    onSkuShow(type) {
      this.skuNextActionType = type;
      this.skuShow = true;
    },
    onSkuConfirm: throttle(function (data) {
      this.skuShow = false;
      if (this.skuNextActionType === 'addCart') {
        this.addCartHandle();
      } else {
        this.setTradeGoods({
          origin: 'buy',
          list: [
            {
              goodsId: this.sku.goodsId,
              name: this.sku.goodInfo.name,
              number: this.initialSku.selectedNum,
              pic: this.sku.goodInfo.pic,
              price: data.selectedSkuComb.price,
              logisticsId: this.basicInfo.logisticsId,
              propertyList: this.initialSku.selectedPropList,
            },
          ],
        });
      }
    }, 1000),
    onConcatService() {
      this.$toast('未开放：客服');
    },
    getGoodsDetail() {
      API_GOODS.goodsDetail({ id: this.$route.query.id }).then((res) => {
        const { pics, basicInfo, content, logistics = {}, properties = [], skuList = [] } = res.data;

        // 商品已下架
        if (basicInfo.status === 1) {
          this.$toast(basicInfo.statusStr);
          return;
        }
        // 商品库存为0
        if (basicInfo.stores === 0) {
          this.$dialog
            .confirm({
              title: '提示',
              message: '该商品已售罄,去看看其他商品吧！',
              showCancelButton: false,
            })
            .then(() => {
              // on confirm
              this.$router.replace({ path: '/home' });
            });
          return;
        }

        document.title = basicInfo.name;
        this.picList = pics;
        this.basicInfo = basicInfo;
        this.logistics = logistics;
        this.content = content;

        this.getSkuData(basicInfo, properties, skuList);
        this.getAfterService();
        // TODO 商品收藏
      });
    },
    getAfterService() {
      this.afterSaleTitle = getAfterSaleTitle(this.basicInfo.afterSale);
    },
    getCartCount() {
      API_CART.shoppingCartInfo().then((res) => {
        this.cartCount = res.data?.number;
      });
    },
    addCartHandle() {
      const params = {
        goodsId: this.sku.goodsId,
        number: this.initialSku.selectedNum,
      };

      if (this.initialSku.selectedPropList.length) {
        params.sku = JSON.stringify(
          this.initialSku.selectedPropList.map((v) => ({
            optionId: v.id,
            optionValueId: v.childId,
          })),
        );
      }

      API_CART.shoppingCartAdd(params)
        .then(() => {
          this.$toast('已成功加入购物车');
          this.getCartCount();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getGoodsReputation() {
      API_GOODS.goodsReputation({ goodsId: this.$route.query.id, page: 1, pageSize: 1 }).then((res) => {
        const records = res.data?.result ?? [];
        const total = res.data?.totalRow ?? 0;
        if (records.length) {
          this.reputationTotal = total;
          this.reputationList = goodReputationModel(records);
        }
      });
    },
    getCouponList() {
      API_DISCOUNTS.discountsCoupons().then((res) => {
        if (res.data) {
          this.couponList = res.data;
        }
      });
    },
    getSkuData(basicInfo, properties, skuList) {
      this.sku = {
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
    },
  },
};
</script>
<style lang="less" scoped>
.section {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px;
  background: #fff;
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
    color: var(--brand-color);

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
    color: var(--gray-color-6);

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
    color: var(--gray-color-6);
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
  background: #fff;
  margin-bottom: 10px;

  &-item {
    flex: 1;
    font-size: 12px;
    color: var(--gray-color-6);

    &:last-child {
      text-align: right;
    }
  }
}

.goods-content {
  box-sizing: border-box;
  background: #fff;
  padding: 0 10px;
  padding-top: 10px;
  overflow: hidden;
  color: var(--color-gray-8);
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  word-wrap: break-word;

  ::v-deep img {
    display: block;
    max-width: 100% !important;
    height: auto !important;
  }

  ::v-deep p {
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
  color: var(--gray-color-8);

  &-title {
    flex-shrink: 0;
    margin-right: 12px;
    color: var(--gray-color-6);
  }

  &-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}
</style>
