<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { loginProviderType } from '@/constants/modules/user';
import { getClientInfo } from '@/utils';
import { isMobile } from '@/utils/validate';

import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loginType = ref('system');
const loginProvider = computed(() => {
  return loginProviderType[unref(loginType)] || {};
});
const checkTypeText = computed(() => {
  return unref(loginType) === 'sms' ? '密码登录' : '验证码登录';
});

function onLoginTypeChange() {
  loginType.value = loginType.value === 'sms' ? 'system' : 'sms';
}

const mobile = ref('');
const pwd = ref('');
const smsCode = ref('');
const agree = ref(true);

function goPage(path: string) {
  router.push({ path });
}

const submitLoading = ref(false);
const submitted = computed(() => {
  if (unref(loginType) === 'sms') {
    return unref(mobile) && unref(smsCode);
  }

  return unref(mobile) && unref(pwd);
});

function onSubmit() {
  if (!isMobile(unref(mobile))) {
    showToast('手机号格式错误');
    return;
  }

  const params: Recordable = {
    mobile: unref(mobile),
    deviceId: getClientInfo().deviceId,
    deviceName: getClientInfo().deviceType,
  };

  if (unref(loginType) === 'system') {
    params.pwd = unref(pwd);
  }

  if (unref(loginType) === 'sms') {
    params.autoReg = true;
    params.code = unref(smsCode);
  }

  submitLoading.value = true;

  userStore
    .login({ provider: unref(loginType), params })
    .then(() => {
      submitLoading.value = false;
      route.query.redirect ? router.replace({ path: route.query.redirect as string }) : router.replace({ path: '/' });
      showToast({
        type: 'success',
        message: '登录成功',
      });
    })
    .catch((err) => {
      console.error(err);
      submitLoading.value = false;
    });
}
</script>

<template>
  <div class="container">
    <div class="main">
      <div class="h2">{{ loginProvider.h2 }}</div>
      <div class="safe-tips">为了你的帐号安全，请用手机号登录</div>
      <form class="form">
        <div class="form-item">
          <div class="form-item-country">中国 +86</div>
          <van-field
            v-model="mobile"
            class="form-field"
            :border="false"
            type="tel"
            placeholder="请输入手机号"
            autocomplete="username"
            clearable
          />
          <input type="text" hidden autocomplete="username" />
        </div>
        <div v-if="loginType === 'system'" class="form-item">
          <PwdField
            v-model="pwd"
            class="form-field"
            :border="false"
            placeholder="请输入密码"
            autocomplete="current-password"
            clearable
          />
        </div>
        <div v-if="loginType === 'sms'" class="form-item">
          <CaptchaCodeField
            v-model="smsCode"
            :mobile="mobile"
            class="form-field"
            :border="false"
            type="number"
            maxlength="4"
            placeholder="请输入4位验证码"
            clearable
          />
        </div>
        <van-button
          class="form-submit"
          block
          :disabled="!submitted"
          :loading="submitLoading"
          loading-text="登录中..."
          type="primary"
          @click="onSubmit"
          >登录</van-button
        >
      </form>
      <div class="check-type">
        <div class="check-type-hd">
          <span class="check-type-btn" @click="onLoginTypeChange">{{ checkTypeText }}</span>
        </div>
        <div class="check-type-bd">
          <template v-if="loginType === 'system'">
            <span class="check-type-btn" @click="goPage('/resetPwd')">忘记密码</span>
            <span class="check-type-separate">|</span>
          </template>
          <span class="check-type-btn" @click="goPage('register')">免费注册</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-agreement">
        <van-checkbox v-model="agree" icon-size="16px" />
        <span> 阅读并同意</span><a href="javascript:void(0);">《用户协议》</a>和<a href="javascript:void(0);"
          >《隐私政策》</a
        >
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/styles/mixins/login.less';

.login();
</style>
