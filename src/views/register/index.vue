<script lang="ts" setup>
import { computed, onMounted, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import Captcha from '@/components/Captcha/index.vue';
import PwdField from '@/components/PwdField/index.vue';
import { nickList } from '@/constants/modules/user';
import { isMobile, isPassWord, isSame } from '@/utils/validate';
import { randomIntegerInRange } from '@/utils/lodash';
import randomIcon from '@/assets/icons/shaizi.svg';

import { useUserStore } from '@/store/modules/user';
import { useSmsCode } from '@/hooks/shared/useSmsCode';

const userStore = useUserStore();

onMounted(() => {
  onNickRandom();
});

const router = useRouter();
const route = useRoute();

const title = ref('免费注册');
const { mobile, smsCode, smsTimer, smsText, captchaShow, onSmsBtnClicked, onSmsSend } = useSmsCode();
const pwd = ref('');
const pwd2 = ref('');

const nick = ref('');
function onNickRandom() {
  nick.value = nickList[randomIntegerInRange(0, nickList.length - 1)];
}

const agree = ref(true);

const submitLoading = ref(false);
const submitted = computed(() => {
  return unref(mobile) && unref(nick) && unref(smsCode) && unref(pwd) && unref(pwd2);
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
    nick: unref(nick),
    pwd: unref(pwd),
    autoLogin: true,
  };

  submitLoading.value = true;

  userStore
    .login({ provider: 'register', params })
    .then(() => {
      submitLoading.value = false;
      route.query.redirect ? router.replace({ path: route.query.redirect as string }) : router.replace({ path: '/' });
      Toast.success('注册成功');
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
          <van-field v-model="nick" class="form-field" :border="false" type="tel" placeholder="请输入昵称" clearable>
            <template #right-icon>
              <img class="icon-random" :src="randomIcon" alt="" @click="onNickRandom" />
            </template>
          </van-field>
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
            placeholder="请设置8-25位(数字+字母)密码"
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

.icon-random {
  display: block;
  width: 20px;
  height: 20px;
}
</style>
