<script lang="ts">
export default {
  name: 'OrderList',
};
</script>

<script lang="ts" setup>
import { reactive, ref, unref, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import API_ORDER from '@/apis/order';
import ProList from '@/components/ProList/index.vue';
import OrderItem from './components/OrderItem.vue';
import { orderListModel } from '@/model/modules/order/list';
import { usePage } from '@/hooks/shared/usePage';

const { onPageLoad } = usePage();

onPageLoad(() => {
  const { status } = route.query;
  if (status) {
    active.value = unref(tabList).findIndex((item) => item.status === status);
  }

  nextTick(() => {
    listRef.value?.loadData();
  });
});

const route = useRoute();

const tabList = ref<Recordable[]>([
  { name: '全部', status: '' },
  { name: '待付款', status: '0' },
  { name: '待发货', status: '1' },
  { name: '待收货', status: '2' },
  { name: '待评价', status: '3' },
]);
const active = ref(0);

function onTabClicked() {
  listQueryType.value = 'query';
  listRef.value?.refresh();
}

const keyword = ref('');

function onSearch() {
  listQueryType.value = 'search';
  listRef.value?.refresh();
}

const listRef = ref<any>(null);

const pagination = reactive({
  pageCurrent: 1,
  pageSize: 10,
});
const listQueryType = ref('query');
const listEmptyText = ref('暂无订单');

function onOrderDelete(_item, index) {
  listRef.value?.deleteItemByIndex(index);
}

function loadList() {
  const params: Recordable = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
    status: unref(tabList)[unref(active)].status,
  };

  if (unref(keyword)) {
    params.orderNumber = unref(keyword); // 订单编号
  }

  listEmptyText.value = unref(listQueryType) === 'search' ? '未找到符合条件数据' : '暂无订单';

  return API_ORDER.orderList(params);
}

function loadListAfter(data) {
  const records = orderListModel(data?.orderList ?? [], data?.goodsMap ?? []);
  return records;
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

    <ProList
      ref="listRef"
      :api="loadList"
      :after-fetch="loadListAfter"
      :pagination="pagination"
      :empty-text="listEmptyText"
      :immediate="false"
    >
      <template #item="{ item, index }">
        <OrderItem :key="item.id" :item="item" :index="index" @delete="onOrderDelete" />
      </template>
    </ProList>
  </div>
</template>

<style lang="less" scoped>
//
</style>
