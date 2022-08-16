<template>
  <div class="container">
    <ProList :api="loadList" :pagination="pagination" :empty-text="listEmptyText" :empty-image="listEmptyImage">
      <template #item="{ item }">
        <div class="list-item van-hairline--bottom">
          <div class="list-item-hd">
            <div class="list-item-title">{{ item.typeStr }}</div>
            <div class="list-item-txt">{{ item.dateAdd }}</div>
          </div>
          <div :class="['list-item-bd', item.behavior ? 'c-red' : 'c-green']">
            <span>{{ item.behavior ? '-' : '+' }}</span>
            <span>{{ item.amount | countPair }}</span>
          </div>
        </div>
      </template>
    </ProList>
  </div>
</template>

<script>
import API_USER from '@/apis/user';
import { countPair } from '@/utils/format';
import ProList from '@/components/ProList';

export default {
  components: { ProList },
  filters: {
    countPair,
  },
  data() {
    return {
      pagination: {
        pageCurrent: 1,
        pageSize: 20,
      },
      listEmptyText: '暂无资金记录',
      listEmptyImage: require('@/assets/images/empty/trade.png'),
    };
  },
  created() {
    //
  },
  methods: {
    loadList() {
      const params = {
        page: this.pagination.pageCurrent,
        pageSize: this.pagination.pageSize,
      };

      return API_USER.userCashLog(params);
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

  &-bd {
    // flex:1;
  }

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
