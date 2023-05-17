import { defineComponent, ref, nextTick, onUpdated } from 'vue';
// Composable
import { useRect, useScrollParent, useEventListener } from '@vant/use';

// styles
import './index.less';

export default defineComponent({
  name: 'AppInfiniteScroller',
  props: {
    loading: Boolean,
    noMore: Boolean,
    offset: {
      type: Number,
      default: 300,
    },
  },
  emits: ['loadMore', 'update:loading'],
  setup(props, { emit, slots }) {
    const loading = ref(false);
    const root = ref<HTMLElement>();
    const placeholder = ref<HTMLElement>();
    const scrollParent = useScrollParent(root);

    const check = () => {
      nextTick(() => {
        if (loading.value || props.noMore) {
          return;
        }

        const scrollParentRect = useRect(scrollParent);

        if (!scrollParentRect.height) {
          return;
        }

        let isReachEdge = false;
        const placeholderRect = useRect(placeholder);

        isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= props.offset;

        if (isReachEdge) {
          loading.value = true;
          emit('update:loading', true);
          emit('loadMore');
        }
      });
    };

    useEventListener('scroll', check, {
      target: scrollParent,
      passive: true,
    });

    onUpdated(() => {
      loading.value = props.loading;
    });

    return () => {
      const Content = slots.default?.();
      const Placeholder = <div ref={placeholder} class="app-infinite__placeholder" />;

      return (
        <div ref={root} class="app-infinite">
          {Content}
          {Placeholder}
        </div>
      );
    };
  },
});
