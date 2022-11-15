<template>
  <div class="container">
    <ProList :api="loadList" :after-fetch="loadListAfter" :pagination="pagination" :empty-text="listEmptyText">
      <template #item="{ item }">
        <div class="list-item">
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
      </template>
    </ProList>
  </div>
</template>

<script lang="ts">
import API_GOODS from '@/apis/goods';
import ProList from '@/components/ProList/index.vue';
import { goodReputationModel } from '@/model/modules/good/reputation';

export default {
  name: 'GoodReputation',
  components: { ProList },
  data() {
    return {
      pagination: {
        pageCurrent: 1,
        pageSize: 20,
      },
      listEmptyText: '暂无评价',
    };
  },
  created() {
    //
  },
  methods: {
    loadList() {
      const params = {
        goodsId: this.$route.query.goodsId,
        page: this.pagination.pageCurrent,
        pageSize: this.pagination.pageSize,
      };

      return API_GOODS.goodsReputation(params);
    },
    loadListAfter(data) {
      const records = goodReputationModel(data?.result ?? []);
      return records;
    },
  },
};
</script>

<style lang="less" scoped>
.list-item {
  background: #fff;
  margin-bottom: 10px;

  &-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;
  }

  &-name {
    font-size: 14px;
    color: var(--gray-color-8);
    line-height: 1;
  }

  &-inner {
    flex: 1;
    padding-top: 4px;
  }

  &-date {
    font-size: 12px;
    color: var(--gray-color-6);
  }

  &-header {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  &-content {
    padding: 10px 15px;
    color: var(--gray-color-6);
    font-size: 14px;
    line-height: 18px;
  }

  &-prop {
    margin-top: 5px;
    font-size: 12px;
  }
}
</style>
