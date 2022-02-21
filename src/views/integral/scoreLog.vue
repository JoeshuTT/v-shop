<script lang="ts" setup>
import API_SCORE from '@/apis/score';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';
import { onMounted, ref, unref } from 'vue';

onMounted(() => {
  onPage();
});

const list = ref<Recordable[]>([]);
const listLoading = ref(false);
const listFinished = ref(false);
const listError = ref(false);
const listFinishedText = ref('没有更多了');
const listErrorText = ref('请求失败，点击重新加载');
const listEmptyText = ref('暂无交易记录');
const listEmptyImage = IMAGE_LIST_EMPTY;
const pageCurrent = ref(1);
const pageSize = ref(10);

function onPageLoad() {
  if (unref(listFinished)) {
    return;
  }

  pageCurrent.value += 1;
  onPage();
}

function onPage() {
  listLoading.value = true;

  const params = {
    page: unref(pageCurrent),
    pageSize: unref(pageSize),
  };

  API_SCORE.scoreLogs(params)
    .then((res) => {
      const records = res.data?.result ?? [];
      const total = res.data?.totalRow ?? 0;

      list.value = unref(pageCurrent) === 1 ? records : unref(list).concat(records);
      listLoading.value = false;
      listFinished.value = list.value.length >= total;
    })
    .catch((error) => {
      console.error(error);
      listLoading.value = false;
      listError.value = true;
    });
}
</script>

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
          <span>{{ item.behavior ? '' : '+' }}</span>
          <span>{{ item.score }}</span>
        </div>
      </div>
      <template #finished>
        <span v-if="list.length">{{ listFinishedText }}</span>
        <van-empty v-else :image="listEmptyImage" :description="listEmptyText" />
      </template>
    </van-list>
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
