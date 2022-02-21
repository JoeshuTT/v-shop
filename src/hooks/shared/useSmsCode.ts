import { reactive, toRefs, unref } from 'vue';
import { Toast } from 'vant';
import API_VERIFICATION from '@/apis/verification';
import { sms } from '@/constants/modules/user';
import { isMobile } from '@/utils/validate';

/**
 * 短信验证码
 */
export function useSmsCode() {
  const state = reactive({
    // 短信验证码
    mobile: '',
    smsCode: '',
    smsTimer: null as TimeoutHandle | null,
    smsText: '获取验证码',
    smsCount: sms.count,
    // 图形验证码
    captchaShow: false,
  });

  function onSmsBtnClicked() {
    if (!unref(state.mobile)) {
      Toast('请输入手机号');
      return;
    }

    if (!isMobile(unref(state.mobile))) {
      Toast('手机号格式错误');
      return;
    }

    state.captchaShow = true;
  }

  function onSmsSend({ requestId, code }) {
    API_VERIFICATION.verificationSmsGet({
      mobile: unref(state.mobile),
      key: requestId,
      picCode: code,
    }).then(() => {
      Toast({
        message: '短信已发送，请查收',
        duration: 2000,
      });
      countdown(); // 立即执行一次,避免 setInterval 延迟
      state.smsTimer = setInterval(countdown, 1000);
    });
  }

  function countdown() {
    if (state.smsCount > 0) {
      state.smsCount--;
      state.smsText = `已发送(${state.smsCount}s)`;
    } else {
      state.smsCount = sms.count;
      state.smsText = `重新发送`;
      clearInterval(Number(state.smsTimer));
      state.smsTimer = null;
    }
  }

  return {
    ...toRefs(state),
    onSmsBtnClicked,
    onSmsSend,
    countdown,
  };
}
