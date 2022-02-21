<template>
  <div class="list">
    <div v-for="(item, index) in list" :key="item.id" class="list-item" @click="onItemClicked(index)">
      <div v-if="switchable" class="list-item-hd">
        <van-checkbox :value="value === item.id" />
      </div>
      <div class="list-item-bd">
        <div class="list-item-name">
          {{ item.linkMan }} {{ item.mobile }}
          <span v-if="item.isDefault" class="list-item-tag">默认</span>
        </div>
        <div class="list-item-address">
          {{ formatAddress(item.provinceStr, item.cityStr, item.areaStr, item.address) }}
        </div>
      </div>
      <div class="list-item-ft" @click.stop="onDetail(index)">
        <van-icon name="edit" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: [Number, String],
    list: Array,
    switchable: Boolean,
  },
  methods: {
    onSelect(index) {
      const item = this.list[index];
      this.list.forEach((v, i) => {
        this.$set(this.list[i], 'selected', false);
      });

      this.$set(this.list[index], 'selected', true);

      this.$emit('select', item, index);
      this.$emit('input', item.id);
    },
    onDetail(index) {
      const { id } = this.list[index];
      this.$router.push({
        path: '/address/edit',
        query: {
          id: id,
        },
      });
    },
    // eslint-disable-next-line max-params
    formatAddress(provinceStr, cityStr, areaStr, address) {
      let str = provinceStr;

      cityStr.length > 1 && (str += cityStr);
      areaStr.length > 1 && (str += areaStr);
      address && (str += ` ${address}`);

      return str;
    },
    onItemClicked(index) {
      if (this.switchable) {
        this.onSelect(index);
      } else {
        this.onDetail(index);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;

  &-hd {
    padding-right: 10px;
    display: flex;
    justify-content: center;
  }

  &-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0 4px;
    color: #fff;
    font-size: 10px;
    line-height: 14px;
    margin-left: 8px;
    border-radius: 999px;
    background-color: var(--brand-color);
  }

  &-name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 16px;
    line-height: 22px;
  }

  &-address {
    color: var(--gray-color-8);
    font-size: 13px;
    line-height: 18px;
  }

  &-bd {
    flex: 1;
  }

  &-ft {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
  }
}
</style>
