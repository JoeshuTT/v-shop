import { defineComponent, computed, unref } from 'vue';

import type { PropType } from 'vue';
import type { ListMeta } from './types';

import { Loading, Empty } from 'vant';
import AppInfiniteScroller from '../AppInfiniteScroller';

// styles
import './index.less';

export const listDefaultMeta = {
  loadingText: '加载中...',
  errorText: '请求失败，点击重新加载',
  emptyText: '暂无数据',
  emptyImage: 'default',
  loadingMoreText: '加载中...',
  noMoreText: '没有更多了',
};

export default defineComponent({
  name: 'AppList',
  components: { AppInfiniteScroller },
  props: {
    /**
     * 是否加载中(首次请求)
     */
    loading: Boolean,
    /**
     * 是否有列表数据
     */
    hasData: Boolean,
    /**
     * 是否加载失败
     */
    error: Boolean,
    /**
     * 列表加载模式
     * @description
     * - infinite 无限滚动，即常见的滚动到底部时自动加载
     * - basic 基础列表，即无分页情形，只有一页
     * @defaultValue 'basic'
     */
    mode: {
      type: String,
      default: 'basic', // basic, infinite
    },
    /**
     * 是否加载中(加载更多请求)
     */
    loadingMore: Boolean,
    /**
     * 是否没有更多数据了
     */
    noMore: Boolean,
    /**
     * 列表配置项，例如状态文本，数据为空占位图
     */
    meta: {
      type: Object as PropType<ListMeta>,
      default: () => ({}),
    },
  },
  emits: ['update:loading', 'clickError', 'loadMore', 'update:loadingMore'],
  setup(props, { emit, slots }) {
    const mergeMeta = computed(() => ({
      ...listDefaultMeta,
      ...props.meta,
    }));

    function renderLoading() {
      return slots.loading ? (
        slots.loading()
      ) : (
        <Loading class="app-list__loading" type="spinner">
          {unref(mergeMeta).loadingText}
        </Loading>
      );
    }

    function renderEmpty() {
      return slots.empty ? (
        slots.empty()
      ) : (
        <Empty class="app-list__empty" image={unref(mergeMeta).emptyImage} description={unref(mergeMeta).emptyText} />
      );
    }
    /**
     * 首次请求加载失败和加载更多数据请求占位目前用同一个
     */
    function renderError() {
      return slots.error ? (
        slots.error()
      ) : (
        <div
          class="app-list__error"
          onClick={() => {
            emit('clickError');
          }}
        >
          {unref(mergeMeta).errorText}
        </div>
      );
    }

    function renderBottom() {
      return slots.bottom ? (
        slots.bottom()
      ) : (
        <div class="app-list__bottom">
          {props.loadingMore && (
            <Loading size="24px" color="#999">
              {unref(mergeMeta).loadingMoreText}
            </Loading>
          )}
          {props.noMore && unref(mergeMeta).noMoreText}
          {props.error && renderError()}
        </div>
      );
    }

    return () => {
      if (!props.hasData && props.error) {
        return renderError();
      }

      const Content = slots.default?.();
      const wrapperContainer =
        props.mode === 'infinite' ? (
          <AppInfiniteScroller
            class="app-list"
            loading={props.loadingMore}
            noMore={props.noMore}
            onUpdate:loading={(value: boolean) => {
              emit('update:loadingMore', value);
            }}
            onLoadMore={() => {
              emit('loadMore');
            }}
          >
            {Content}
            {renderBottom()}
          </AppInfiniteScroller>
        ) : (
          <div class="app-list">{Content}</div>
        );

      return props.loading ? renderLoading() : props.hasData ? wrapperContainer : renderEmpty();
    };
  },
});
