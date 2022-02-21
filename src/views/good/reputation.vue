<template>
  <div class="container">
    <van-list
      v-model="listLoading"
      class="list"
      :finished="listFinished"
      :finished-text="listFinishedText"
      :error.sync="listError"
      :error-text="listErrorText"
      :immediate-check="false"
      @load="onPageLoad"
    >
      <div v-for="item in list" :key="item.id" class="list-item">
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
      <template #finished>
        <span v-if="list.length">{{ listFinishedText }}</span>
        <van-empty v-else :description="listEmptyText" />
      </template>
    </van-list>
  </div>
</template>

<script>
import API_GOODS from '@/apis/goods';
import { goodReputationModel } from '@/model/modules/good/reputation';

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      listFinished: false,
      listError: false,
      listFinishedText: '没有更多了',
      listErrorText: '请求失败，点击重新加载',
      listEmptyText: '暂无评价',
      pageCurrent: 1,
      pageSize: 20,
    };
  },
  created() {
    this.onPage();
  },
  methods: {
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
        goodsId: this.$route.query.goodsId,
        page: this.pageCurrent,
        pageSize: this.pageSize,
      };

      API_GOODS.goodsReputation(params)
        .then((res) => {
          const records = goodReputationModel(res.data?.result ?? []);
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
