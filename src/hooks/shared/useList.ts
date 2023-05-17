import { Ref, nextTick } from 'vue';
import { unref, reactive, toRefs, onMounted } from 'vue';
import { ListMeta } from '@/components/AppList/types';

export function useList(options: Partial<useListOptions> = {}, list: Ref<any[]>, pagination?: UseListPagination) {
  const {
    immediate = false,
    fieldNames = {
      itemsField: 'items',
      totalRowField: 'total',
    },
    meta = {},
    other,
  } = options;

  const state = reactive({
    loading: true,
    hasData: false,
    loadingMore: false,
    noMore: false,
    error: false,
    immediate,
    meta,
    ...other,
  });

  function refresh() {
    pagination && (pagination.pageCurrent = 1);
    state.loading = true;
    list.value = [];

    loadData();
  }

  function onError() {
    state.error = false;

    loadData();
  }

  function loadMore() {
    if (state.noMore) {
      return;
    }

    pagination && (pagination.pageCurrent += 1);

    loadData();
  }

  function loadData() {
    if (!options.api) {
      return;
    }

    const isFirstPage = !pagination || pagination?.pageCurrent === 1;

    return options
      .api()
      .then((res) => {
        let records = res.data?.[fieldNames.itemsField] ?? [];
        const total = res.data?.[fieldNames.totalRowField] ?? 0;

        if (options.afterFetch) {
          records = options.afterFetch(res.data);
        }

        if (isFirstPage) {
          list.value = records;
          nextTick(() => {
            state.loading = false;
            state.hasData = !!unref(list).length;
          });
        } else {
          list.value = unref(list).concat(records);
          nextTick(() => {
            state.loadingMore = false;
            state.noMore = unref(list).length >= total;
          });
        }
      })
      .catch((err) => {
        console.error(err);

        if (isFirstPage) {
          state.loading = false;
        } else {
          state.loadingMore = false;
        }
        state.error = true;
      });
  }

  onMounted(() => {
    state.immediate && loadData(); // 立刻执行
  });

  return {
    ...toRefs(state),
    // methods
    refresh,
    onError,
    loadMore,
    loadData,
  };
}

export interface useListOptions {
  api: (...arg: any[]) => Promise<any>;
  afterFetch: <T = any>(...arg: T[]) => T;
  immediate: boolean;
  fieldNames: {
    itemsField: string;
    totalRowField: string;
  };
  meta: ListMeta;
  other: Record<string, any>;
}

export interface UseListPagination {
  pageCurrent: number;
  pageSize: number;
}
