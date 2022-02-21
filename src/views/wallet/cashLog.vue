<template>
  <div class="container">
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
      <div v-for="item in list" :key="item.id" class="list-item van-hairline--bottom">
        <div class="list-item-hd">
          <div class="list-item-title">{{ item.typeStr }}</div>
          <div class="list-item-txt">{{ item.dateAdd }}</div>
        </div>
        <div :class="['list-item-bd', item.behavior ? 'c-red' : 'c-green']">
          <span>{{ item.behavior ? '-' : '+' }}</span>
          <span>{{ countPair(item.amount) }}</span>
        </div>
      </div>
      <template #finished>
        <span v-if="list.length">{{ listFinishedText }}</span>
        <van-empty v-else :image="listEmptyImage" :description="listEmptyText" />
      </template>
    </van-list>
  </div>
</template>

<script>
import API_USER from '@/apis/user';
import { countPair } from '@/utils/format';
import IMAGE_EMPTY_TRADE from '@/assets/images/empty/trade.png';

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      listFinished: false,
      listError: false,
      listFinishedText: '没有更多了',
      listErrorText: '请求失败，点击重新加载',
      listEmptyText: '暂无资金记录',
      listEmptyImage: IMAGE_EMPTY_TRADE,
      pageCurrent: 1,
      pageSize: 20,
    };
  },
  mounted() {
    this.onPage();
  },
  methods: {
    countPair,
    onPageLoad() {
      if (this.listFinished) {
        return;
      }
      this.pageCurrent += 1;
      this.onPage();
    },
    onPage() {
      this.listLoading = true;

      const params = {
        page: this.pageCurrent,
        pageSize: this.pageSize,
      };

      API_USER.userCashLog(params)
        .then((res) => {
          const records = res.data?.result ?? [];
          const total = res.data?.totalRow ?? 0;

          this.list = this.pageCurrent === 1 ? records : this.list.concat(records);
          this.listLoading = false;
          this.listFinished = this.list.length >= total;
        })
        .catch((error) => {
          console.error(error);
          this.listLoading = false;
          this.listError = true;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.list-item {
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  background: var(--white);

  &-hd {
    flex: 1;
  }

  // &-bd {
  //   flex: 1;
  // }

  &-title {
    margin-bottom: 5px;
    font-size: 16px;
    color: var(--gray-color-8);
  }

  &-txt {
    font-size: 14px;
    color: var(--gray-color-6);
  }
}

.c-red {
  color: var(--red-color);
}

.c-green {
  color: var(--green-color);
}
</style>
