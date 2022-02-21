<template>
  <div class="container">
    <div class="tab-list">
      <van-tabs v-model:active="active" @click-tab="onTabClicked">
        <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
      </van-tabs>
    </div>
    <SpainList v-model:loading="listLoading">
      <div v-if="list.length" class="list">
        <div v-for="item in list" :key="item.id" class="list-item">
          <div class="list-item-hd" :style="[{ background: tabList[active] ? tabList[active].bg : '' }]">
            <div class="list-item-money">
              <span class="list-item-price">{{ item.money }}</span>
              <span class="list-item-price-unit">元</span>
            </div>
            <div class="list-item-desc van-ellipsis">{{ thresholdTitle(item.moneyHreshold) }}</div>
          </div>
          <div class="list-item-bd">
            <div class="list-item-bd-inner">
              <div class="list-item-bd-title van-ellipsis">{{ item.name }}</div>
              <div class="list-item-bd-txt">{{ dateFormat(item.dateStart) }}至{{ dateFormat(item.dateEnd) }}</div>
            </div>
            <div v-if="active === 0" class="list-item-bd-action" @click="onCouponClicked">
              {{ tabList[active] ? tabList[active].buttonTxt : '' }}
            </div>
          </div>
        </div>
      </div>
      <van-empty v-else class="empty" :image="listEmptyImage" :description="listEmptyText">
        <van-button v-if="active === 0" class="empty-btn" round plain type="primary">进店逛逛</van-button>
      </van-empty>
    </SpainList>
    <div class="exchange">
      <div class="exchange-btn" @click="onPopupShow">兑换优惠口令</div>
    </div>
    <!-- 兑换优惠口令弹窗 -->
    <ExchangeCoupon v-model:show="exchangeShow" @success="onExchangeSuccess" />
  </div>
</template>

<script>
import SpainList from '@/components/SpainList/index.vue';
import ExchangeCoupon from '@/components/ExchangeCoupon/index.vue';
import API_DISCOUNTS from '@/apis/discounts';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/coupon.png';

export default {
  components: { SpainList, ExchangeCoupon },
  data() {
    return {
      tabList: [
        {
          name: '未使用',
          status: 0,
          bg: 'linear-gradient(300deg, rgb(250, 122, 122), rgb(254, 49, 78))',
          buttonTxt: '立即使用',
        },
        { name: '已使用', status: 3, bg: '#c8c9cc', buttonTxt: '已使用' },
        { name: '已过期', status: 2, bg: '#c8c9cc', buttonTxt: '已过期' },
      ],
      active: 0,

      list: [],
      listLoading: true,
      listEmptyText: '暂无优惠券',
      listEmptyImage: IMAGE_LIST_EMPTY,

      exchangeShow: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    dateFormat(val) {
      return val.slice(0, 10);
    },
    thresholdTitle(val) {
      let str = '';
      if (val === 0) {
        str = '满任意金额可用';
      } else {
        str = `满${val}元可用`;
      }
      return str;
    },
    onPopupShow() {
      this.exchangeShow = true;
    },
    onExchangeSuccess() {
      this.exchangeShow = false;
      if (this.active === 0) {
        this.getList();
      }
    },
    onTabClicked() {
      if (!this.listLoading) {
        this.getList();
      }
    },
    onCouponClicked() {
      this.$router.replace({ path: '/home' });
    },
    getList() {
      this.listLoading = true;

      API_DISCOUNTS.discountsMy({ status: this.tabList[this.active].status })
        .then((res) => {
          this.list = res.data || [];
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  box-sizing: border-box;
  padding-top: 5px;
}
.list-item {
  box-sizing: border-box;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  margin-left: 15px;
  margin-right: 15px;
  background: var(--white);
  box-shadow: 0px 2px 4px 2px rgba(228, 228, 228, 0.5);

  &-hd {
    box-sizing: border-box;
    width: 34%;
    text-align: center;
    height: 100%;
    padding: 20px 0;
    font-size: 12px;
    color: var(--white);
  }

  &-money {
    margin-bottom: 5px;
  }

  &-price {
    font-size: 30px;
    font-weight: bold;

    &-unit {
      margin-left: 5px;
      font-size: 12px;
    }
  }

  &-bd {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0;

    &-title {
      font-size: 16px;
      color: var(--gray-color-8);
      margin-bottom: 10px;
    }

    &-txt {
      font-size: 12px;
      color: var(--gray-color-6);
    }

    &-action {
      font-size: 10px;
      color: var(--red-color);
      border: 1px solid var(--red-color);
      border-radius: 15px;
      padding: 5px 10px;
    }
  }
}

.empty {
  &-btn {
    padding: 0 10px;
    margin-bottom: 70px;
    height: 32px;
    line-height: 30px;
  }
}

.tab-list {
  height: calc(50px + constant(safe-area-inset-top));
  height: calc(50px + env(safe-area-inset-top));

  .van-tabs {
    box-sizing: border-box;
    margin-bottom: 15px;
    z-index: 3;
    position: fixed;
    width: 100%;
    height: 50px;
    top: 0;
    left: 0;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }
}

.exchange {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));

  &-btn {
    position: fixed;
    z-index: 3;
    bottom: 0;
    width: 100%;
    height: 50px;
    color: var(--gray-color-8);
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--white);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
