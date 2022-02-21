<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { version } from '../../../package.json';
import Copyright from '@/components/Copyright';

import { useUserStore } from '@/store/modules/user';

const router = useRouter();
const userStore = useUserStore();

const versionName = `版本号 v${version}`;

// function onDarkThemeToggle() {
//   document.documentElement.classList.toggle('dark');
// }

function onLogout() {
  userStore.logout().then(() => {
    router.back();
  });
}
</script>

<template>
  <div class="container">
    <van-cell title="个人资料" is-link to="/profile" />
    <van-cell title="地址管理" is-link to="/address" />
    <!-- <van-cell title="深色模式（实验）" class="mb10" @click="onDarkThemeToggle" /> -->
    <van-cell title="主题风格" is-link to="/theme" />
    <van-cell title="关于" :value="versionName" />
    <div class="mb10"></div>
    <van-button block @click="onLogout">退出登录</van-button>
    <!-- 版权 -->
    <Copyright />
  </div>
</template>

<style lang="less" scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>
