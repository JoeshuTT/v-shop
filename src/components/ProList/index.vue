<template>
  <van-list
    v-model="loading"
    class="list"
    :finished="finished"
    :finished-text="finishedText"
    :error.sync="error"
    :error-text="errorText"
    :immediate-check="false"
    :offset="offset"
    :direction="direction"
    @load="onLoadMore"
  >
    <template v-for="(item, index) in list">
      <slot name="item" v-bind="{ item, index }"></slot>
    </template>
    <template #finished>
      <span v-if="list.length">{{ finishedText }}</span>
      <van-empty v-else :image="emptyImage || 'default'" :description="emptyText" />
    </template>
  </van-list>
</template>

<script>
import { isFunction } from '@/utils/validate';

export default {
  name: 'ProList',
  props: {
    // 接口请求Promise对象
    api: {
      type: Function,
      required: true,
      default: null,
    },
    // 自定义处理接口返回数据
    afterFetch: {
      type: Function,
      default: null,
    },
    // 分页配置
    pagination: {
      type: Object,
      default: () => ({
        pageCurrent: 1,
        pageSize: 20,
      }),
    },
    // 立即请求接口
    immediate: {
      type: Boolean,
      default: true,
    },
    emptyImage: {
      type: String,
      default: '',
    },
    emptyText: {
      type: String,
      default: '暂无数据',
    },
    errorText: {
      type: String,
      default: '请求失败，点击重新加载',
    },
    loadingText: {
      type: String,
      default: '加载中...',
    },
    finishedText: {
      type: String,
      default: '没有更多了',
    },
    offset: {
      type: [Number, String],
      default: 300,
    },
    direction: {
      type: String,
      default: 'down',
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      error: false,
      finished: false,
    };
  },
  created() {
    this.immediate && this.onLoad();
  },
  methods: {
    deleteItemByIndex(index) {
      this.list.splice(index, 1);
    },
    refresh() {
      if (this.loading) {
        return;
      }

      this.pagination.pageCurrent = 1;
      this.list = [];
      this.listFinished = false;
      this.onLoad();
    },
    onLoadMore() {
      if (this.finished) {
        return;
      }
      this.pagination.pageCurrent += 1;
      this.onLoad();
    },
    onLoad() {
      this.loading = true;

      this.api()
        .then((res) => {
          let records = res.data?.result ?? [];
          const total = res.data?.totalRow ?? 0;

          if (this.afterFetch && isFunction(this.afterFetch)) {
            records = this.afterFetch(res.data);
          }

          this.list = this.pagination.pageCurrent === 1 ? records : this.list.concat(records);
          this.finished = this.list.length >= total;
        })
        .catch((error) => {
          console.error(error);
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
