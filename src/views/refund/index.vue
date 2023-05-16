<template>
  <div class="container">
    <ProList
      v-model:dataSource="list"
      mode="infinite"
      :api="getDataList"
      :afterFetch="listAfterFetch"
      :pagination="pagination"
      :meta="listMeta"
      immediate
    >
      <div class="list">
        <div v-for="(item, index) in list" :key="index" class="list-item">
          <div class="list-item-header van-hairline--bottom">
            <div class="list-item-header-hd">
              <span class="title">订单编号：{{ item.orderInfo.orderNumber }}</span>
            </div>
            <div :class="['list-item-header-state', item.status !== -1 ? 'text-primary-color' : '']">
              {{ item.orderInfo.statusStr }}
            </div>
          </div>
          <div class="list-item-body" @click="onOrderClicked(item)">
            <div v-if="item" class="good-card">
              <van-image fit="contain" class="good-card-pic" :src="item.pic" />
              <div class="good-card-content">
                <div class="good-card-title">{{ item.goodsName }}</div>
                <div v-if="item.property" class="good-card-prop">{{ item.property }}</div>
                <div class="good-card-number">数量：{{ item.number }}</div>
              </div>
            </div>
          </div>
          <!-- ▼ 操作按钮组（一行最好不要超过3个） -->
          <div class="list-item-footer van-hairline--top">
            <template v-if="item.afterSale">
              <van-button class="list-item-action-btn" round plain type="primary" @click="onOrderClicked(item)">
                申请售后
              </van-button>
            </template>
            <template v-else>
              <span>不支持售后退换服务</span>
            </template>
          </div>
          <!-- ▲ 操作按钮组 -->
        </div>
      </div>
    </ProList>
  </div>
</template>

<script lang="ts">
import NP from 'number-precision';
import API_ORDER from '@/apis/order';
import { orderAfterSaleListModel } from '@/model/modules/order/afterSale';

export default {
  data() {
    return {
      list: [] as Recordable[],
      pagination: {
        pageCurrent: 1,
        pageSize: 20,
      },
      listMeta: {
        emptyText: '暂无售后',
      },
    };
  },
  methods: {
    getDataList() {
      const params = {
        statusBatch: `1,2,3,4`,
        page: this.pagination.pageCurrent,
        pageSize: this.pagination.pageSize,
      };

      return API_ORDER.orderList(params);
    },
    listAfterFetch(data) {
      const records = orderAfterSaleListModel(data?.orderList ?? [], data?.goodsMap ?? []);
      return records;
    },
    onOrderClicked(item) {
      const { id, afterSale, amountSingle, number, orderInfo } = item;
      this.$router.push({
        path: '/refund/apply',
        query: {
          orderId: orderInfo.id,
          orderGoodsId: id,
          afterSale: afterSale,
          amount: NP.times(amountSingle, number),
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  display: flex;
  padding: 0 15px;
  align-items: center;
  height: 60px;
  background: var(--color-bg-2);

  &-form {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &-field {
    width: 100%;
    padding: 0;
    margin-right: 10px;

    :deep(.van-icon-search) {
      color: var(--color-primary);
      font-size: 17px;
    }
    :deep(.van-search) {
      padding: 6px 8px 6px 0;
    }
  }

  &-btn {
    box-sizing: border-box;
    padding: 0;
    width: 52px;
    height: 36px;
    line-height: 36px;
    border: 1px solid #c7c7c7;
    color: var(--color-text-1);
    font-size: 14px;
  }
}

.list {
  &-item {
    .van-hairline--bottom::after {
      right: -44%;
      left: -44%;
    }

    margin: 10px;
    border-radius: 8px;
    background: var(--color-bg-2);
    padding-bottom: 10px;

    &-header {
      display: flex;
      padding: 10px 12px;
      align-items: center;
      font-size: 14px;
      color: var(--color-text-1);

      &-hd {
        flex: 1;
        margin-right: 10px;
      }

      &-state {
        text-align: right;
        color: var(--color-text-3);
      }
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 10px 0;
      font-size: 12px;
      color: var(--color-text-3);
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
  }

  &-title {
    font-size: 14px;
    color: var(--color-text-1);
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-prop {
    font-size: 12px;
    color: var(--color-text-3);
    line-height: 16px;
    margin-top: 8px;
  }

  &-price {
    color: var(--color-text-1);
    letter-spacing: 0;
    font-size: 14px;
  }

  &-number {
    color: var(--color-text-3);
    line-height: 16px;
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
