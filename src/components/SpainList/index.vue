<script lang="tsx">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SpainList',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () =>
      props.loading ? (
        <van-loading size={`24px`} align={`center`} style={{ padding: '15px 0' }}>
          加载中...
        </van-loading>
      ) : (
        slots.default?.()
      );
  },
});
</script>
