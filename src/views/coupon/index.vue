<script setup lang="ts">
import { reactive, ref, unref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import API_DISCOUNTS from '@/apis/discounts';
import ExchangeCoupon from './components/ExchangeCoupon/index.vue';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/coupon.png';

const router = useRouter();

onMounted(() => {
  getDataList();
});

const tabList = ref<Recordable[]>([
  {
    name: '未使用',
    status: 0,
    customClass: 'red',
    buttonTxt: '立即使用',
  },
  { name: '已使用', status: 3, customClass: 'gray', buttonTxt: '已使用' },
  { name: '已过期', status: 2, customClass: 'gray', buttonTxt: '已过期' },
]);
const active = ref(0);
const list = ref<Recordable[]>([]);
const listLoading = ref(true);
const listMeta = reactive({
  emptyText: '暂无优惠券',
  emptyImage: IMAGE_LIST_EMPTY,
});

function getDataList() {
  listLoading.value = true;

  API_DISCOUNTS.discountsMy({ status: unref(tabList)[unref(active)].status })
    .then((res) => {
      list.value = res.data || [];
    })
    .finally(() => {
      listLoading.value = false;
    });
}

function dateFormat(val) {
  return val.slice(0, 10);
}

function thresholdTitle(val) {
  let str = '';
  if (val === 0) {
    str = '满任意金额可用';
  } else {
    str = `满${val}元可用`;
  }
  return str;
}

function goHome() {
  router.replace({ path: '/home' });
}

function onTabClicked() {
  if (!unref(listLoading)) {
    getDataList();
  }
}
function onCouponClicked() {
  goHome();
}

// 兑换优惠口令
const exchangeShow = ref(false);
function onExchangeSuccess() {
  exchangeShow.value = false;
  if (unref(active) === 0) {
    getDataList();
  }
}
</script>

<template>
  <div class="container">
    <div class="tab-list">
      <van-tabs v-model:active="active" @click-tab="onTabClicked">
        <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
      </van-tabs>
    </div>
    <AppList v-model:loading="listLoading" :hasData="!!list.length">
      <div class="list" :class="[tabList[active] ? tabList[active].customClass : '']">
        <div v-for="item in list" :key="item.id" class="list-item">
          <div class="list-item-hd">
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
      <template #empty>
        <van-empty class="empty" :image="listMeta.emptyImage" :description="listMeta.emptyText">
          <van-button v-if="active === 0" class="empty-btn" round plain type="primary" @click="goHome"
            >进店逛逛</van-button
          >
        </van-empty>
      </template>
    </AppList>

    <!-- 兑换优惠口令-->
    <ExchangeCoupon v-model:show="exchangeShow" @success="onExchangeSuccess" />
  </div>
</template>

<style lang="less" scoped>
.list {
  box-sizing: border-box;
  padding-top: 5px;
}

.list.red .list-item-hd {
  background: linear-gradient(300deg, rgb(250, 122, 122), rgb(254, 49, 78));
}

.list.gray .list-item-hd {
  background: #ccc;
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
  background: var(--color-bg-2);
  box-shadow: 0px 2px 4px 2px rgba(228, 228, 228, 0.5);

  &-hd {
    box-sizing: border-box;
    width: 34%;
    text-align: center;
    height: 100%;
    padding: 20px 0;
    font-size: 12px;
    color: var(--color-bg-2);
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
      color: var(--color-text-1);
      margin-bottom: 10px;
    }

    &-txt {
      font-size: 12px;
      color: var(--color-text-3);
    }

    &-action {
      font-size: 10px;
      color: var(--color-red);
      border: 1px solid var(--color-red);
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
  height: calc(50px + var(--safe-area-height-top));

  .van-tabs {
    box-sizing: border-box;
    margin-bottom: 15px;
    z-index: 3;
    position: fixed;
    width: 100%;
    height: 50px;
    top: 0;
    left: 0;
    padding-top: var(--safe-area-height-top);
  }
}

.dark {
  .list-item {
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.5);
  }

  .list.gray .list-item-hd {
    background: #5f5f60;
  }
}
</style>
