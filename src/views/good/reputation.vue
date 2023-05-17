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
            <div class="list-item-avatar"><van-image :src="item.avatarUrl" alt="" /></div>
            <div class="list-item-inner">
              <div class="list-item-name">{{ item.nickName }}</div>
              <div class="list-item-star">
                <van-rate v-model="item.rate" :size="14" color="#f44" void-icon="star" void-color="#eee" readonly />
              </div>
            </div>
            <div class="list-item-date">{{ item.date }}</div>
          </div>
          <div class="list-item-content">
            <div class="list-item-remark">{{ item.remark }}</div>
            <div v-if="item.property" class="list-item-prop">{{ item.property }}</div>
          </div>
        </div>
      </div>
    </ProList>
  </div>
</template>

<script lang="ts">
import API_GOODS from '@/apis/goods';
import { goodReputationModel } from '@/model/modules/good/reputation';

export default {
  data() {
    return {
      list: [] as Recordable[],
      pagination: {
        pageCurrent: 1,
        pageSize: 20,
      },
      listMeta: {
        emptyText: '暂无评价',
      },
    };
  },
  methods: {
    getDataList() {
      const params = {
        goodsId: this.$route.query.goodsId,
        page: this.pagination.pageCurrent,
        pageSize: this.pagination.pageSize,
      };

      return API_GOODS.goodsReputation(params);
    },
    listAfterFetch(data) {
      const records = goodReputationModel(data?.result ?? []);

      return records;
    },
  },
};
</script>

<style lang="less" scoped>
.list-item {
  margin-bottom: 10px;
  background: var(--color-bg-2);

  &-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;
  }

  &-name {
    font-size: 14px;
    color: var(--color-text-1);
    line-height: 1;
  }

  &-inner {
    flex: 1;
    padding-top: 4px;
  }

  &-date {
    font-size: 12px;
    color: var(--color-text-3);
  }

  &-header {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  &-content {
    padding: 10px 15px;
    color: var(--color-text-3);
    font-size: 14px;
    line-height: 18px;
  }

  &-prop {
    margin-top: 5px;
    font-size: 12px;
  }
}
</style>
