<script>
export default {
  name: 'SpainList',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    return this.value ? (
      <van-loading size={`24px`} align={`center`} style={{ padding: '15px 0' }}>
        加载中...
      </van-loading>
    ) : (
      this.$slots.default
    );
  },
};
</script>
