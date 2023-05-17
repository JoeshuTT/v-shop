<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import API_USER from '@/apis/user';
import { isMobile, isPassWord, isSame } from '@/utils/validate';

const router = useRouter();

const title = ref('重置密码');
const mobile = ref('');
const smsCode = ref('');
const pwd = ref('');
const pwd2 = ref('');

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
    pwd: unref(pwd),
  };

  submitLoading.value = true;

  API_USER.userMResetPwd(params)
    .then(() => {
      submitLoading.value = false;
      router.back();
      showToast({
        type: 'success',
        message: '重置成功',
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
            placeholder="请设置8-25位(数字+字母)新密码"
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
            placeholder="请再次输入新密码"
            autocomplete="new-password"
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
      </form>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/styles/mixins/login.less';

.login();
</style>
