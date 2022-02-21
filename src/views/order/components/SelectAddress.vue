<template>
  <van-popup
    :value="value"
    round
    closeable
    position="bottom"
    class="address-popup"
    @click-close-icon="onClose"
    @click-overlay="onClose"
  >
    <div class="address-header">选择收货地址</div>
    <div class="address-body">
      <AddressList
        v-if="list.length"
        v-model="addressId"
        class="address-list"
        :switchable="true"
        :list="list"
        @select="onSelect"
      />
    </div>
    <div class="address-actions">
      <van-button type="primary" round block @click="onSubmit">新增地址</van-button>
    </div>
  </van-popup>
</template>

<script>
import API_USER from '@/apis/user';
import AddressList from '@/components/AddressList';

export default {
  components: { AddressList },
  props: {
    value: Boolean,
  },
  data() {
    return {
      list: [],
      addressId: '',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onClose() {
      this.$emit('input', false);
    },
    onOpen() {
      this.$emit('input', true);
    },
    onSelect(item, index) {
      this.$emit('select', item, index);
      this.onClose();
    },
    getList() {
      this.listLoading = true;

      API_USER.userShoppingAddressList()
        .then((res) => {
          this.list = res.data?.result ?? [];

          if (this.list.length) {
            this.addressId = this.list[0].id;
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    onSubmit() {
      this.$router.push({ path: '/address', query: { origin: 'selected' } });
    },
  },
};
</script>

<style lang="less" scoped>
.address {
  &-popup {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    max-height: 80%;
    min-height: 50%;
    overflow-y: visible;
    font-size: 14px;
    background: #fff;
  }

  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: var(--gray-color-8);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    min-height: 40vh;
    max-height: 80vh;
    overflow-y: auto;
    background: var(--gray-color-1);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  &-list {
    margin: 12px 12px 80px;
  }

  &-actions {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}
</style>
