<script setup lang="ts">
import { useRouter } from 'vue-router';
import IMAGE_RELOAD from '@/assets/images/exception/reload.png';

const router = useRouter();

function onReload() {
  router.back();
}
</script>

<template>
  <div class="container">
    <img :src="IMAGE_RELOAD" class="image" />
    <div class="title">页面加载异常或服务器开小差了</div>
    <div class="action van-haptics-feedback" @click="onReload">重新加载</div>
  </div>
</template>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  padding-top: 10vh;
  background: var(--color-bg-1);
  text-align: center;
}

.image {
  width: 261px;
  height: 143px;
  margin-bottom: 10px;
}

.title {
  color: #999;
  font-size: 14px;
}

.action {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  color: #38f;
}

.dark .image {
  opacity: 0.5;
}
</style>
