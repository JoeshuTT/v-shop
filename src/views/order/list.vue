<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import API_ORDER from '@/apis/order';
import Price from '@/components/Price/index.vue';
import { orderListModel } from '@/model/modules/order/list';
import { decimalFormat } from '@/utils/format';

import { useOrderStore } from '@/store/modules/order';

onMounted(() => {
  const { status } = route.query;
  if (status) {
    active.value = unref(tabList).findIndex((item) => item.status === status);
  }
  onPage();
});

const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();

const tabList = ref<Recordable[]>([
  { name: '全部', status: '' },
  { name: '待付款', status: '0' },
  { name: '待发货', status: '1' },
  { name: '待收货', status: '2' },
  { name: '待评价', status: '3' },
]);
const active = ref(0);

function onTabClicked() {
  onPageRefresh();
}

const keyword = ref('');

function onSearch() {
  onPageRefresh('search');
}

const list = ref<Recordable[]>([]);
const listLoading = ref(false);
const listFinished = ref(false);
const listError = ref(false);
const listFinishedText = ref('没有更多了');
const listErrorText = ref('请求失败，点击重新加载');
const listEmptyText = ref('暂无订单');
const pageCurrent = ref(1);
const pageSize = ref(10);

function onOrderClicked(index: number) {
  const { orderNumber } = list.value[index];
  router.push({
    path: '/order/detail',
    query: {
      orderNumber,
    },
  });
}

function onConcatService(_index?: number) {
  Toast('未开放：客服');
}

function onOrderCancel(orderId: number, index: number) {
  orderStore
    .closeOrder({ orderId })
    .then(() => {
      Toast({ message: '取消订单成功', duration: 1500 });
      list.value[index].status = -1;
      list.value[index].statusStr = `订单关闭`;
    })
    .catch((error) => {
      console.error(error);
    });
}

function onOrderDelete(orderId: number, index: number) {
  orderStore
    .deleteOrder({ orderId })
    .then(() => {
      Toast({ message: '删除订单成功', duration: 1500 });
      list.value.splice(index, 1);
    })
    .catch((error) => {
      console.error(error);
    });
}

function onPageRefresh(mode = 'query') {
  if (!unref(listLoading)) {
    listFinished.value = false;
    list.value = [];
    pageCurrent.value = 1;
    onPage(mode);
  }
}

function onPageLoad() {
  if (unref(listFinished)) {
    return;
  }

  pageCurrent.value += 1;
  onPage();
}

function onPage(mode = 'query') {
  listLoading.value = true;

  const params: Recordable = {
    status: unref(tabList)[unref(active)].status,
    page: unref(pageCurrent),
    pageSize: unref(pageSize),
  };

  if (unref(keyword)) {
    params.orderNumber = unref(keyword); // 订单编号
  }

  listEmptyText.value = mode === 'search' ? '未找到符合条件数据' : '暂无订单';

  API_ORDER.orderList(params)
    .then((res) => {
      const records = orderListModel(res.data?.orderList ?? [], res.data?.goodsMap ?? []);
      const total = res.data?.totalRow ?? 0;

      list.value = unref(pageCurrent) === 1 ? records : unref(list).concat(records);
      listLoading.value = false;
      listFinished.value = list.value.length >= total;
    })
    .catch((error) => {
      console.error(error);
      listLoading.value = false;
      listError.value = true;
    });
}
</script>

<template>
  <div class="container">
    <van-sticky>
      <div class="header">
        <form action="#" class="search-form">
          <van-search
            v-model="keyword"
            class="search-field"
            shape="round"
            show-action
            placeholder="搜索订单（订单编号）"
            @search="onSearch"
          >
            <template #action>
              <div v-if="keyword" @click="onSearch">搜索</div>
            </template>
          </van-search>
        </form>
        <van-tabs v-model:active="active" @click-tab="onTabClicked">
          <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
        </van-tabs>
      </div>
    </van-sticky>

    <van-list
      v-model:loading="listLoading"
      v-model:error="listError"
      class="list"
      :finished="listFinished"
      :finished-text="listFinishedText"
      :error-text="listErrorText"
      :immediate-check="false"
      @load="onPageLoad"
    >
      <div v-for="(item, index) in list" :key="item.id" class="list-item">
        <div class="list-item-header van-hairline--bottom">
          <div class="list-item-header-hd">
            <span class="title">订单编号：{{ item.orderNumber }}</span>
          </div>
          <div :class="['list-item-header-state', item.status !== -1 ? 'text-brand-color' : '']">
            {{ item.statusStr }}
          </div>
        </div>
        <div class="list-item-body" @click="onOrderClicked(index)">
          <div v-if="item.goodsInfo" class="good-card">
            <van-image fit="contain" class="good-card-pic" :src="item.goodsInfo.pic" />
            <div class="good-card-content">
              <div class="good-card-content-hd">
                <div class="good-card-title">{{ item.goodsInfo.goodsName }}</div>
                <div v-if="item.goodsInfo.property" class="good-card-prop">{{ item.goodsInfo.property }}</div>
              </div>
              <div class="good-card-content-bd">
                <div class="good-card-price">¥{{ decimalFormat(item.goodsInfo.amount) }}</div>
                <div class="good-card-number">x{{ item.goodsInfo.number }}</div>
              </div>
            </div>
          </div>
          <div v-if="item.goodsNumber > 1" class="list-item-more">查看全部{{ item.goodsNumber }}件商品</div>
          <div class="list-item-total van-hairline--top">
            <span class="list-item-total-number">共{{ item.goodsNumber }}件商品</span>
            <div class="list-item-total-price">
              <span class="list-item-total-price-label"> {{ item.status === 0 ? '需付款：' : '实付款：' }}</span>
              <Price :price="item.amountReal" />
            </div>
          </div>
        </div>
        <!-- ▼ 操作按钮组（一行最好不要超过3个） -->
        <div class="list-item-footer van-hairline--top">
          <template v-if="item.status === -1 || item.status === 3 || item.status === 4">
            <van-button class="list-item-action-btn" round @click.stop="onOrderDelete(item.id, index)"
              >删除订单</van-button
            >
          </template>
          <template v-if="item.status === 0">
            <van-button class="list-item-action-btn" round plain @click.stop="onOrderCancel(item.id, index)">
              取消订单
            </van-button>
            <van-button class="list-item-action-btn" round plain type="primary" @click.stop="onOrderClicked(index)">
              去支付
            </van-button>
          </template>
          <template v-if="item.status === 1">
            <van-button icon="service" class="list-item-action-btn" round @click.stop="onConcatService(index)">
              联系客服
            </van-button>
          </template>
          <template v-if="item.status === 2">
            <van-button class="list-item-action-btn" round @click.stop="onOrderClicked(index)">确认收货</van-button>
          </template>
          <template v-if="item.status === 3">
            <van-button class="list-item-action-btn" round @click.stop="onOrderClicked(index)">评价</van-button>
          </template>
        </div>
        <!-- ▲ 操作按钮组 -->
      </div>
      <template #finished>
        <span v-if="list.length">{{ listFinishedText }}</span>
        <van-empty v-else :description="listEmptyText" />
      </template>
    </van-list>
  </div>
</template>

<style lang="less" scoped>
.list {
  &-item {
    .van-hairline--bottom::after {
      right: -44%;
      left: -44%;
    }

    margin: 10px;
    border-radius: 8px;
    background: #fff;
    padding-bottom: 10px;

    &-header {
      display: flex;
      padding: 10px 12px;
      align-items: center;
      font-size: 14px;
      color: var(--gray-color-8);

      &-hd {
        flex: 1;
        margin-right: 10px;
      }

      &-state {
        text-align: right;
        color: var(--gray-color-6);
      }
    }

    &-more {
      font-size: 14px;
      color: var(--gray-color-6);
      padding: 5px;
      line-height: 28px;
      text-align: center;
    }

    &-total {
      height: 48px;
      padding: 0 12px;
      color: var(--gray-color-8);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;

      &-number {
        margin-right: 5px;
      }

      &-price {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
      }
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 10px 0;
    }

    &-action-btn {
      height: 32px;
      padding: 0 8px;
      min-width: 80px;
      font-size: 14px;

      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }
}

.good-card {
  position: relative;
  box-sizing: border-box;
  padding: 12px 12px 10px;
  display: flex;

  &-pic {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    margin-right: 8px;
    overflow: hidden;
  }

  &-content {
    flex: 1;
    display: flex;

    &-hd {
      flex: 1;
      margin-right: 12px;
    }
    &-bd {
      text-align: right;
    }
  }

  &-title {
    font-size: 14px;
    color: var(--gray-color-8);
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-prop {
    font-size: 12px;
    color: var(--gray-color-6);
    line-height: 16px;
    margin-top: 8px;
  }

  &-price {
    color: var(--gray-color-8);
    letter-spacing: 0;
    font-size: 14px;
  }

  &-number {
    color: var(--gray-color-6);
    line-height: 16px;
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
