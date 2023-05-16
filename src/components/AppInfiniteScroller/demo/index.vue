<script setup lang="ts">
import { ref, onMounted } from 'vue';

onMounted(() => {
  loadList();
});

const list = ref<Recordable[]>([]);
const loading = ref(false);
const noMore = ref(false);

function loadList() {
  console.log(`loadList`);
  setTimeout(() => {
    const result: Recordable[] = [];
    for (let i = 0; i < 20; i++) {
      result.push({
        id: `${i}`,
        title: `第${i + 1}条数据`,
      });
    }

    list.value = result;
  }, 0.3 * 1000);
}

function loadMore() {
  console.log(`loadMore`);
  setTimeout(() => {
    const result: Recordable[] = [];
    for (let i = list.value.length; i < list.value.length + 20; i++) {
      result.push({
        id: `${i}`,
        title: `第${i + 1}条数据`,
      });
    }

    list.value = list.value.concat(result);

    if (list.value.length >= 80) {
      noMore.value = true;
    }

    loading.value = false;
  }, 2 * 1000);
}
</script>

<template>
  <div class="container">
    <van-tabs>
      <van-tab title="基本使用">
        <AppInfiniteScroll v-model:loading="loading" :noMore="noMore" @load-more="loadMore">
          <div class="list">
            <van-cell v-for="item in list" :key="item.id" :title="item.title" />
            <div class="list-bottom">
              <template v-if="loading">
                <van-loading size="24px" color="#999">加载中...</van-loading>
              </template>
              <template v-if="noMore">
                <span>没有更多了</span>
              </template>
            </div>
          </div>
        </AppInfiniteScroll>
      </van-tab>
      <van-tab title="自定义加载文案">
        <AppInfiniteScroll v-model:loading="loading" :noMore="noMore" class="list" @load-more="loadMore">
          <van-cell v-for="item in list" :key="item.id" :title="item.title" />
          <div class="list-bottom">
            <template v-if="loading">
              <span> 等会儿我... </span>
            </template>
            <template v-if="noMore">
              <span>--- 我是有底线的 ---</span>
            </template>
          </div>
        </AppInfiniteScroll>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less">
.list {
  .van-cell {
    text-align: center;
  }

  &-bottom {
    width: 100%;
    color: var(--color-text-3);
    font-size: 14px;
    line-height: 50px;
    text-align: center;
  }
}
</style>
