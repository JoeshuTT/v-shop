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
    <Captcha v-model="captchaShow" @success="onSmsSend" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import API_VERIFICATION from '@/apis/verification';
import Captcha from '@/components/Captcha';
import PwdField from '@/components/PwdField';
import { nickList, sms } from '@/utils/constant';
import { isMobile, isPassWord, isSame } from '@/utils/validate';
import { randomIntegerInRange } from '@/utils/lodash';

export default {
  components: { Captcha, PwdField },
  data() {
    return {
      title: '免费注册',
      mobile: '',
      pwd: '',
      pwd2: '',
      nick: '',
      // 短信验证码
      smsCode: '',
      smsTimer: null,
      smsText: '获取验证码',
      smsCount: sms.count,
      // 图形验证码
      captchaShow: false,

      submitLoading: false,

      agree: true,
      randomIcon: require('@/assets/icons/shaizi.svg'),
    };
  },
  computed: {
    submitted() {
      return this.mobile && this.nick && this.smsCode && this.pwd && this.pwd2;
    },
  },
  created() {
    this.onNickRandom();
  },
  methods: {
    ...mapActions({
      login: 'user/login',
    }),
    onNickRandom() {
      this.nick = nickList[randomIntegerInRange(0, nickList.length - 1)];
    },
    onSmsBtnClicked() {
      if (!this.mobile) {
        this.$toast('请输入手机号');
        return;
      }

      if (!isMobile(this.mobile)) {
        this.$toast('手机号格式错误');
        return;
      }

      this.captchaShow = true;
    },
    onSmsSend({ requestId, code }) {
      API_VERIFICATION.verificationSmsGet({
        mobile: this.mobile,
        key: requestId,
        picCode: code,
      }).then(() => {
        this.$toast('短信已发送，请查收');
        this.countdown(); // 立即执行一次,避免 setInterval 延迟
        this.smsTimer = setInterval(this.countdown, 1000);
      });
    },
    countdown() {
      if (this.smsCount > 0) {
        this.smsCount--;
        this.smsText = `已发送(${this.smsCount}s)`;
      } else {
        this.smsCount = sms.count;
        this.smsText = `重新发送`;
        clearInterval(this.smsTimer);
        this.smsTimer = null;
      }
    },
    onSubmit() {
      if (!isMobile(this.mobile)) {
        this.$toast('手机号格式错误');
        return;
      }

      if (!isPassWord(this.pwd)) {
        this.$toast('请设置8-25位(数字+字母)密码');
        return;
      }

      if (!isSame(this.pwd, this.pwd2)) {
        this.$toast('2次输入密码不一致');
        return;
      }

      const params = {
        mobile: this.mobile,
        code: this.smsCode,
        nick: this.nick,
        pwd: this.pwd,
        autoLogin: true,
      };

      this.submitLoading = true;

      this.login({ provider: 'register', params })
        .then(() => {
          this.submitLoading = false;
          this.$route.query.redirect
            ? this.$router.replace({ path: this.$route.query.redirect })
            : this.$router.replace({ path: '/' });
          this.$toast.success('注册成功');
        })
        .catch((error) => {
          this.submitLoading = false;
          console.error(error);
        });
    },
  },
};
</script>

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
