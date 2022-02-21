import { reactive, toRefs } from 'vue';

export function useList(options: Recordable = {}) {
  const state = reactive({
    list: [],
    listLoading: false,
    listFinished: false,
    listError: false,
    listFinishedText: '没有更多了',
    listErrorText: '请求失败，点击重新加载',
    listEmptyText: '暂无数据',
    listEmptyImage: '',
    pageCurrent: 1,
    pageSize: 10,
  });

  if (options.listEmptyImage) {
    state.listEmptyImage = options.listEmptyImage;
  }

  return {
    ...toRefs(state),
  };
}
