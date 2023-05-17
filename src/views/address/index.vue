<template>
  <div class="container">
    <SpainList v-model:loading="listLoading">
      <AddressList v-if="list.length" :list="list" />
      <van-empty v-else class="empty" :description="listEmptyText"> </van-empty>
    </SpainList>
    <AffixBar>
      <van-button class="submit-bar-button" type="primary" round @click="onAdd">
        <van-icon name="plus" />
        新建收货地址
      </van-button>
    </AffixBar>
  </div>
</template>

<script>
import API_USER from '@/apis/user';
import SpainList from '@/components/SpainList/index.vue';
import AddressList from '@/components/AddressList/index.vue';

export default {
  components: { SpainList, AddressList },
  data() {
    return {
      list: [],
      listLoading: true,
      listEmptyText: '暂无地址',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onSelected(index) {
      this.list.forEach((v, i) => {
        this.$set(this.list[i], 'selected', false);
      });

      this.$set(this.list[index], 'selected', true);
    },
    onAdd() {
      this.$router.push({ path: '/address/edit' });
    },
    // eslint-disable-next-line max-params
    formatAddress(provinceStr, cityStr, areaStr, address) {
      let str = provinceStr;

      cityStr.length > 1 && (str += cityStr);
      areaStr.length > 1 && (str += areaStr);
      address && (str += ` ${address}`);

      return str;
    },
    onItemClicked(id) {
      this.$router.push({
        path: '/address/edit',
        query: {
          id: id,
        },
      });
    },
    getList() {
      this.listLoading = true;

      API_USER.userShoppingAddressList()
        .then((res) => {
          this.list = res.data?.result ?? [];
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px;
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
    background-color: var(--color-primary);
  }

  &-name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 16px;
    line-height: 22px;
  }

  &-address {
    color: var(--color-text-1);
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

.submit-bar {
  &-button {
    width: 80%;
    height: 34px;
    letter-spacing: 2px;
  }
}
</style>
