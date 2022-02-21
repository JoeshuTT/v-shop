<script>
import { mapGetters } from 'vuex';
import { fromCamelCase } from '@/utils/lodash';

export default {
  computed: {
    ...mapGetters({
      theme: 'app/theme',
    }),
  },
  render() {
    const { colors } = this.theme;
    // 生成主题变量
    const cssVarList = Object.keys(colors).map((key) => `--${fromCamelCase(key, '-')}:${colors[key]}`);

    const cssText = cssVarList.join(';');

    return (
      <div id="app" style={cssText}>
        {this.$slots.default}
      </div>
    );
  },
};
</script>
