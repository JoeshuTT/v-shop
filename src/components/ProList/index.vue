<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, computed } from 'vue';
import AppList from '../AppList';
import { useListOptions, UseListPagination, useList } from '@/hooks/shared/useList';

export default defineComponent({
  name: 'ProList',
  components: { AppList },
  inheritAttrs: false,
  props: {
    dataSource: {
      type: Array,
      required: true,
      default: () => [],
    },
    pagination: {
      type: Object as PropType<UseListPagination>,
      default: () => ({
        pageCurrent: 1,
        pageSize: 20,
      }),
    },
    fieldNames: {
      type: Object as PropType<useListOptions['fieldNames']>,
      default: () => ({
        itemsField: 'result',
        totalRowField: 'totalRow',
      }),
    },
    mode: String,
    immediate: Boolean,
  },
  emits: ['update:dataSource'],
  setup(props, { attrs, emit, expose }) {
    const list = computed({
      get() {
        return props.dataSource;
      },
      set(newValue) {
        emit('update:dataSource', newValue);
      },
    });
    const { loading, hasData, loadingMore, noMore, error, meta, refresh, onError, loadMore, loadData } = useList(
      {
        ...attrs,
        ...props,
      },
      list,
      props.pagination,
    );

    expose({ refresh, onError, loadMore, loadData });

    return {
      loading,
      hasData,
      loadingMore,
      noMore,
      error,
      meta,
      loadMore,
      onError,
    };
  },
});
</script>

<template>
  <AppList
    v-model:loading="loading"
    v-model:loadingMore="loadingMore"
    :mode="mode"
    :error="error"
    :hasData="hasData"
    :noMore="noMore"
    :meta="meta"
    @load-more="loadMore"
    @click-error="onError"
  >
    <slot></slot>
  </AppList>
</template>
