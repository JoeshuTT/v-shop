<script lang="tsx">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Price',
  props: {
    price: [Number, String],
    symbol: {
      type: String,
      default: '¥',
    },
  },
  setup(props) {
    function getInteger(n: any) {
      if (Number.isNaN(Number(n))) {
        // eslint-disable-next-line no-param-reassign
        n = 0;
      }
      const numArr: string[] = Number(n).toFixed(2).split('.');
      return numArr[0];
    }

    function getDecimal(n: any) {
      if (Number.isNaN(Number(n))) {
        // eslint-disable-next-line no-param-reassign
        n = 0;
      }
      const numArr: string[] = Number(n).toFixed(2).split('.');

      return `.${numArr[1]}`;
    }

    return () => (
      <span class="price">
        <span class="price-symbol">{props.symbol}</span>
        <span class="price-integer">{getInteger(props.price)}</span>
        <span class="price-decimal">{getDecimal(props.price)}</span>
      </span>
    );
  },
});
</script>

<style lang="less" scoped>
.price {
  &-symbol {
    margin-right: 2px;
    font-size: 12px;
  }

  &-integer {
    font-size: 18px;
    font-weight: bold;
    font-family: @font-family-price-integer;
  }

  &-decimal {
    font-size: 12px;
    font-weight: bold;
  }
}
</style>
