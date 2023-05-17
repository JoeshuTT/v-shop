<script setup lang="ts">
import { ref, onMounted } from 'vue';

onMounted(() => {
  loadList();
});

const list = ref<Record<string, any>>([]);
const loading = ref(false);
const hasData = ref(false);

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
</script>

<template>
  <div class="container">
    <van-tabs>
      <van-tab title="基本使用">
        <AppList v-model:loading="loading" :hasData="hasData">
          <div class="list">
            <van-cell v-for="item in list" :key="item.id" :title="item.title" />
          </div>
        </AppList>
      </van-tab>
      <van-tab title="滚动加载"> ... </van-tab>
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
