<script lang="ts" setup>
import { computed, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import Captcha from '@/components/Captcha/index.vue';
import { loginProviderType } from '@/constants/modules/user';
import { isMobile } from '@/utils/validate';
import deviceId from '@/utils/helpers/deviceId';
import deviceModel from '@/utils/helpers/deviceModel';

import { useUserStore } from '@/store/modules/user';
import { useSmsCode } from '@/hooks/shared/useSmsCode';

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

const { mobile, smsCode, smsTimer, smsText, captchaShow, onSmsBtnClicked, onSmsSend } = useSmsCode();
const pwd = ref('');
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
    Toast('手机号格式错误');
    return;
  }

  const params: Recordable = {
    mobile: unref(mobile),
    deviceId: deviceId(),
    deviceName: deviceModel(),
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
      router.replace({ path: '/mine' });
      Toast.success('登录成功');
    })
    .catch((error) => {
      submitLoading.value = false;
      console.error(error);
    });
}
</script>

<template>
  <div class="container">
    <div class="main">
      <div class="h2">{{ loginProvider.h2 }}</div>
      <div class="safe-tips">为了你的帐号安全，请用手机号登录</div>
      <div class="form">
        <div class="form-item">
          <div class="form-item-country">中国 +86</div>
          <van-field
            v-model="mobile"
            class="form-field"
            :border="false"
            type="tel"
            placeholder="请输入手机号"
            clearable
          />
        </div>
        <div v-if="loginType === 'system'" class="form-item">
          <van-field
            v-model="pwd"
            class="form-field"
            :border="false"
            type="password"
            placeholder="请输入密码"
            clearable
          />
        </div>
        <div v-if="loginType === 'sms'" class="form-item">
          <van-field
            v-model="smsCode"
            class="form-field"
            :border="false"
            type="number"
            placeholder="请输入4位验证码"
            clearable
          />
          <template v-if="smsTimer">
            <span class="sms-btn countdown">{{ smsText }}</span>
          </template>
          <template v-else>
            <span class="sms-btn" @click="onSmsBtnClicked">{{ smsText }}</span>
          </template>
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
      </div>
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
    <!-- 图形验证码 -->
    <Captcha v-model:show="captchaShow" @success="onSmsSend" />
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 30px;
}

.h2 {
  margin-top: 40px;
  font-size: 24px;
  font-weight: bold;
  color: var(--gray-color-8);
  line-height: 24px;
}

.safe-tips {
  font-size: 14px;
  color: var(--gray-color-6);
  margin-top: 20px;
  line-height: 14px;
}

.main {
  flex: 1;
  min-height: 420px;
}

.form {
  &-item {
    padding: 20px 0 10px;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    font-size: 14px;

    &-country {
      padding-right: 10px;
      margin-right: 10px;
      color: var(--gray-color-8);
      position: relative;

      &::after {
        display: block;
        content: ' ';
        width: 1px;
        height: 14px;
        background: @border-color;
        position: absolute;
        top: 50%;
        margin-top: -7px;
        right: 0;
      }
    }
  }

  &-field {
    flex: 1;
    background: none;
    padding: 0;
  }

  &-submit {
    margin-top: 30px;
    font-size: 16px;
  }
}

.sms-btn {
  color: #38f;
  font-size: 14px;
  margin-left: 10px;

  &.countdown {
    font-size: 12px;
    color: var(--gray-color-6);
  }
}

.check-type {
  box-sizing: border-box;
  padding: 20px 0;
  font-size: 12px;
  color: #38f;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-separate {
    display: inline-flex;
    color: @border-color;
    margin: 0 5px 0 5px;
  }
}

.footer {
  margin-bottom: 30px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  &-agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--gray-color-6);

    .van-checkbox {
      margin-right: 6px;
    }

    a {
      color: #38f;
    }
  }
}
</style>
