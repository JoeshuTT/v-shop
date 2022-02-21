<script>
export default {
  name: 'Price',
  props: {
    price: [Number, String],
    symbol: {
      type: String,
      default: '¥',
    },
  },
  render() {
    function getInteger(n) {
      if (Number.isNaN(Number(n))) {
        // eslint-disable-next-line no-param-reassign
        n = 0;
      }
      const numArr = Number(n).toFixed(2).split('.');
      return numArr[0];
    }

    function getDecimal(n) {
      if (Number.isNaN(Number(n))) {
        // eslint-disable-next-line no-param-reassign
        n = 0;
      }
      const numArr = Number(n).toFixed(2).split('.');

      return `.${numArr[1]}`;
    }

    return (
      <span class="price">
        <span class="price-symbol">{this.symbol}</span>
        <span class="price-integer">{getInteger(this.price)}</span>
        <span class="price-decimal">{getDecimal(this.price)}</span>
      </span>
    );
  },
};
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
