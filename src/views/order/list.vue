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

        <van-tabs v-model="active" @click="onTabClicked">
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
    >
      <template #item="{ item, index }">
        <OrderItem :key="item.id" :item="item" :index="index" @delete="onOrderDelete" />
      </template>
    </ProList>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import API_ORDER from '@/apis/order';
import { orderListModel } from '@/model/modules/order/list';
import { decimalFormat } from '@/utils/format';
import ProList from '@/components/ProList';
import OrderItem from './components/OrderItem';

export default {
  components: { ProList, OrderItem },
  filters: { decimalFormat },
  data() {
    return {
      tabList: [
        { name: '全部', status: '' },
        { name: '待付款', status: '0' },
        { name: '待发货', status: '1' },
        { name: '待收货', status: '2' },
        { name: '待评价', status: '3' },
      ],
      active: 0,
      keyword: '',

      pagination: {
        pageCurrent: 1,
        pageSize: 10,
      },
      listQueryType: 'query',
      listEmptyText: '暂无订单',
    };
  },
  created() {
    const { status } = this.$route.query;
    if (status) {
      this.active = this.tabList.findIndex((item) => item.status === status);
    }
    //
  },
  methods: {
    ...mapActions({
      deleteOrder: 'order/deleteOrder',
      closeOrder: 'order/closeOrder',
    }),
    onSearch() {
      this.listQueryType = 'search';
      this.$refs.listRef.refresh();
    },
    onTabClicked() {
      this.listQueryType = 'query';
      this.$refs.listRef.refresh();
    },
    onOrderDelete(_item, index) {
      this.$refs.listRef.deleteItemByIndex(index);
    },
    loadList() {
      const params = {
        status: this.tabList[this.active].status,
        page: this.pageCurrent,
        pageSize: this.pageSize,
      };

      if (this.keyword) {
        params.orderNumber = this.keyword; // 订单编号
      }

      this.listEmptyText = this.listQueryType === 'search' ? '未找到符合条件数据' : '暂无订单';

      return API_ORDER.orderList(params);
    },
    loadListAfter(data) {
      const records = orderListModel(data?.orderList ?? [], data?.goodsMap ?? []);
      return records;
    },
  },
};
</script>

<style lang="less" scoped></style>
