<template>
  <div class="container">
    <van-cell title="个人资料" is-link to="/profile" />
    <van-cell title="地址管理" is-link to="/address" />
    <!-- <van-cell title="深色模式（实验）" class="mb10" @click="onDarkThemeToggle" /> -->
    <van-cell title="主题风格" is-link to="/theme" />
    <van-cell title="关于" :value="versionName" />
    <div class="mb10"></div>
    <van-button block @click="onLogout">退出登录</van-button>

    <Copyright />
  </div>
</template>

<script>
import { version } from '../../../package.json';
import { mapActions } from 'vuex';
import Copyright from '@/components/Copyright';

export default {
  components: { Copyright },
  data() {
    return {
      versionName: `版本号 v${version}`,
    };
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
    }),
    onDarkThemeToggle() {
      document.documentElement.classList.toggle('dark');
    },
    onLogout() {
      this.logout().then(() => {
        this.$router.back();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>
