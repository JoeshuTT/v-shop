<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Copyright from '@/components/Copyright';

import { useUserStore } from '@/store/modules/user';
import { getClientInfo } from '@/utils';

const router = useRouter();
const userStore = useUserStore();

const versionName = `版本号 v${__APP_INFO__.pkg.version}`;
const popupShow = ref(false);
const clientInfo = getClientInfo();
const deviceInfoList = ref(
  Object.keys(clientInfo).map((k) => ({
    label: k,
    value: clientInfo[k],
  })),
);

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
    <van-cell title="主题风格" is-link to="/theme" />
    <van-cell title="我的设备" value="点击查看" clickable @click="popupShow = true" />
    <van-cell title="关于" :value="versionName" />
    <div class="mb10"></div>
    <van-button class="btn" block @click="onLogout">退出登录</van-button>
    <!-- 版权 -->
    <Copyright />
    <!-- 我的设备 -->
    <van-popup
      v-model:show="popupShow"
      round
      style="
         {
          width: 80%;
        }
      "
    >
      <div class="header">
        <div class="header-title">我的设备</div>
      </div>
      <div class="info scroller-y">
        <div v-for="(item, index) in deviceInfoList" :key="index" class="info-p">
          <div class="info-p-label">{{ item.label }}</div>
          <div class="info-p-value">{{ item?.value ?? '-' }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.mb10 {
  margin-bottom: 10px;
}

.btn {
  width: 92vw;
  margin: 0 auto;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0 5px;

  &-title {
    font-size: 18px;
    color: #080808;
    margin-bottom: 10px;
  }

  &-sub {
    font-size: 14px;

    color: #666666;
  }
}

.info {
  box-sizing: border-box;
  padding: 10px 20px;
  border-top: 1px solid var(--color-border-2);
  height: 60vh;

  &-p {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-text-1);
    margin-bottom: 10px;

    &-label {
      margin-right: 10px;
      color: var(--color-text-3);
    }

    &-value {
      flex: 1;
      display: flex;
      align-items: center;
      word-break: break-all;
    }
  }
}
</style>
