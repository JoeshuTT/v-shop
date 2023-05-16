<script setup lang="ts">
import { reactive, ref } from 'vue';
import API_SCORE from '@/apis/score';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';

const list = ref<Recordable[]>([]);
const pagination = reactive({
  pageCurrent: 1,
  pageSize: 20,
});
const listMeta = reactive({
  emptyText: '暂无交易记录',
  emptyImage: IMAGE_LIST_EMPTY,
});

function getDataList() {
  const params = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
  };

  return API_SCORE.scoreLogs(params);
}
</script>

<template>
  <div class="container">
    <ProList
      v-model:dataSource="list"
      mode="infinite"
      :api="getDataList"
      :pagination="pagination"
      :meta="listMeta"
      immediate
    >
      <div class="list">
        <div v-for="(item, index) in list" :key="index" class="list-item van-hairline--bottom">
          <div class="list-item-hd">
            <div class="list-item-title">{{ item.typeStr }}</div>
            <div class="list-item-txt">{{ item.dateAdd }}</div>
          </div>
          <div :class="['list-item-bd', item.behavior ? 'c-red' : 'c-green']">
            <span>{{ item.behavior ? '' : '+' }}</span>
            <span>{{ item.score }}</span>
          </div>
        </div>
      </div>
    </ProList>
  </div>
</template>

<style lang="less" scoped>
.list-item {
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  background: var(--color-bg-2);

  &-hd {
    flex: 1;
  }

  &-bd {
    // flex:1;
  }

  &-title {
    margin-bottom: 5px;
    font-size: 16px;
    color: var(--color-text-1);
  }

  &-txt {
    font-size: 14px;
    color: var(--color-text-3);
  }
}

.c-red {
  color: var(--color-red);
}

.c-green {
  color: var(--color-green);
}
</style>
