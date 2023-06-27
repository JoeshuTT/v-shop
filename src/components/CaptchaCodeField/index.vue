<script setup lang="ts">
import { reactive, unref, watch } from 'vue';
import { showToast } from 'vant';
import API_VERIFICATION from '@/apis/verification';
import { sms } from '@/constants/modules/user';
import { isMobile } from '@/utils/validate';
import { useCountDown } from '@/hooks/shared/useCountDown';

const props = defineProps({
  mobile: [String, Number],
});

const { count: smsCount, start: countdown } = useCountDown();

const state = reactive({
  // 短信验证码
  smsText: '获取验证码',
  // 图形验证码
  captchaShow: false,
});

function onSmsBtnClicked() {
  if (!unref(props.mobile)) {
    showToast('请输入手机号');
    return;
  }

  if (!isMobile(unref(String(props.mobile)))) {
    showToast('手机号格式错误');
    return;
  }

  state.captchaShow = true;
}

function onCaptchaConfirm({ requestId, code }) {
  API_VERIFICATION.verificationSmsGet({
    mobile: unref(props.mobile),
    key: requestId,
    picCode: code,
  })
    .then(() => {
      state.captchaShow = false;
      showToast({
        message: '短信已发送，请查收',
        duration: 2000,
      });

      countdown(sms.count);
    })
    .catch((err) => {
      console.error(err);
    });
}

watch(smsCount, () => {
  if (smsCount.value > 0) {
    state.smsText = `已发送(${smsCount.value}s)`;
  } else {
    state.smsText = `重新发送`;
  }
});
</script>

<template>
  <van-field>
    <template #button>
      <span v-if="smsCount" class="sms-btn countdown">{{ state.smsText }}</span>
      <span v-else class="sms-btn" @click="onSmsBtnClicked">{{ state.smsText }}</span>
      <!-- 图形验证码 -->
      <CaptchaPopup v-model:show="state.captchaShow" @confirm="onCaptchaConfirm" />
    </template>
  </van-field>
</template>

<style lang="less" scoped>
.sms-btn {
  color: #38f;
  font-size: 14px;
  margin-left: 10px;

  &.countdown {
    font-size: 12px;
    color: var(--color-text-3);
  }
}
</style>
