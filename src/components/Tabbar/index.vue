<template>
  <div class="tabbar-wrap">
    <van-tabbar v-model="active" class="tabbar" fixed>
      <van-tabbar-item
        v-for="(item, index) in tabList"
        :key="index"
        :name="item.pagePath"
        @click.native="onTabClicked(index)"
      >
        <template #icon>
          <van-icon :name="item.icon" />
        </template>
        {{ item.text }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Tabbar',
  data() {
    return {
      active: '/home',
    };
  },
  computed: {
    ...mapGetters({
      tabBar: 'app/tabBar',
    }),
    tabList() {
      const tabList = this.tabBar.list;

      return tabList;
    },
  },
  watch: {
    $route: {
      handler({ path }) {
        this.active = path;
      },
      immediate: true,
    },
  },
  methods: {
    onTabClicked(index) {
      const { pagePath } = this.tabList[index];
      this.$router.replace({
        path: pagePath,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tabbar-wrap {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));
}

::v-deep .van-tabbar-item--active {
  color: var(--brand-color);
}
</style>
