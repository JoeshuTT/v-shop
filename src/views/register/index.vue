<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { isMobile, isPassWord, isSame } from '@/utils/validate';
import { fakeNickName } from '@/model';

import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

const title = ref('免费注册');
const mobile = ref('');
const smsCode = ref('');
const pwd = ref('');
const pwd2 = ref('');
const agree = ref(true);

const submitLoading = ref(false);
const submitted = computed(() => {
  return unref(mobile) && unref(smsCode) && unref(pwd) && unref(pwd2);
});

function onSubmit() {
  if (!isMobile(unref(mobile))) {
    showToast('手机号格式错误');
    return;
  }

  if (!isPassWord(unref(pwd))) {
    showToast('请设置8-25位(数字+字母)密码');
    return;
  }

  if (!isSame(unref(pwd), unref(pwd2))) {
    showToast('2次输入密码不一致');
    return;
  }

  const params = {
    mobile: unref(mobile),
    code: unref(smsCode),
    nick: fakeNickName({ type: 'mobile', mobile: unref(mobile) }),
    pwd: unref(pwd),
    autoLogin: true,
  };

  submitLoading.value = true;

  userStore
    .login({ provider: 'register', params })
    .then(() => {
      submitLoading.value = false;
      route.query.redirect ? router.replace({ path: route.query.redirect as string }) : router.replace({ path: '/' });
      showToast({
        type: 'success',
        message: '注册成功',
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
      <div class="h2">{{ title }}</div>
      <form class="form">
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
        <div class="form-item">
          <PwdField
            key="pwd"
            v-model="pwd"
            class="form-field"
            :border="false"
            placeholder="请设置8-25位(数字+字母)密码"
            autocomplete="new-password"
            clearable
          />
        </div>
        <div class="form-item">
          <PwdField
            key="pwd2"
            v-model="pwd2"
            class="form-field"
            :border="false"
            placeholder="请再次输入密码"
            autocomplete="new-password"
            clearable
          />
        </div>
        <van-button
          class="form-submit"
          block
          :disabled="!submitted"
          :loading="submitLoading"
          loading-text="注册中..."
          type="primary"
          @click="onSubmit"
          >确定</van-button
        >
      </form>
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
