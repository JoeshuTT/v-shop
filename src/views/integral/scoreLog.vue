<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import API_SCORE from '@/apis/score';
import ProList from '@/components/ProList/index.vue';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';

onMounted(() => {
  //
});

const pagination = reactive({
  pageCurrent: 1,
  pageSize: 20,
});
const listEmptyText = ref('暂无交易记录');
const listEmptyImage = IMAGE_LIST_EMPTY;

function loadList() {
  const params = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
  };

  return API_SCORE.scoreLogs(params);
}
</script>

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
            <span>{{ item.behavior ? '' : '+' }}</span>
            <span>{{ item.score }}</span>
          </div>
        </div>
      </template>
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
