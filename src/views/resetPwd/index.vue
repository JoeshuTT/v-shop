<script lang="ts" setup>
import { computed, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import API_USER from '@/apis/user';
import Captcha from '@/components/Captcha/index.vue';
import PwdField from '@/components/PwdField/index.vue';
import { isMobile, isPassWord, isSame } from '@/utils/validate';

import { useSmsCode } from '@/hooks/shared/useSmsCode';

const router = useRouter();

const title = ref('重置密码');
const { mobile, smsCode, smsTimer, smsText, captchaShow, onSmsBtnClicked, onSmsSend } = useSmsCode();
const pwd = ref('');
const pwd2 = ref('');
// const agree = ref(true);
const submitLoading = ref(false);
const submitted = computed(() => {
  return unref(mobile) && unref(smsCode) && unref(pwd) && unref(pwd2);
});

function onSubmit() {
  if (!isMobile(unref(mobile))) {
    Toast('手机号格式错误');
    return;
  }

  if (!isPassWord(unref(pwd))) {
    Toast('请设置8-25位(数字+字母)密码');
    return;
  }

  if (!isSame(unref(pwd), unref(pwd2))) {
    Toast('2次输入密码不一致');
    return;
  }

  const params = {
    mobile: unref(mobile),
    code: unref(smsCode),
    pwd: unref(pwd),
  };

  submitLoading.value = true;

  API_USER.userMResetPwd(params)
    .then(() => {
      submitLoading.value = false;
      router.back();
      Toast.success('重置成功');
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
      <div class="h2">{{ title }}</div>
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
        <div class="form-item">
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
        <div class="form-item">
          <PwdField
            key="pwd"
            v-model="pwd"
            class="form-field"
            :border="false"
            placeholder="请设置8-25位(数字+字母)新密码"
            clearable
          />
        </div>
        <div class="form-item">
          <PwdField
            key="pwd2"
            v-model="pwd2"
            class="form-field"
            :border="false"
            placeholder="请再次输入新密码"
            clearable
          />
        </div>
        <van-button
          class="form-submit"
          block
          :disabled="!submitted"
          :loading="submitLoading"
          loading-text="重置中..."
          type="primary"
          @click="onSubmit"
          >确定</van-button
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
