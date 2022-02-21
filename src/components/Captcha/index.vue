<template>
  <van-popup :value="value" class="captcha-popup" position="center" @click-overlay="onClose">
    <div class="captcha-popup-close" @click="onClose">
      <van-icon class="captcha-popup-close-icon" name="cross" />
    </div>
    <div class="captcha-container">
      <div class="captcha-header van-hairline--bottom">请完成安全验证</div>
      <div class="captcha-body">
        <div class="captcha-code">
          <van-field
            v-model="code"
            clearable
            :border="false"
            placeholder="输入验证码"
            class="captcha-field"
            type="text"
            focus
          >
          </van-field>
          <img
            class="captcha-img"
            :style="[{ width: codeWidth + 'px', 'aspect-ratio': 4, background: 'var(--gray-color-3)' }]"
            :src="pic"
            @click="onRefresh"
          />
        </div>
        <div class="tips" @click="onRefresh">看不清，换一张</div>
        <div class="captcha-footer">
          <van-button class="captcha-btn" block :disabled="!submitted" type="primary" @click="onSubmit">
            确认发送
          </van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
import { throttle, rpx2px } from '@/utils';
import API_VERIFICATION from '@/apis/verification';

export default {
  name: 'Captcha',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      requestId: '',
      pic: '',
      code: '',
      codeWidth: rpx2px(150),
    };
  },
  computed: {
    submitted() {
      return this.code.length;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.getCaptcha();
        }
      },
      immediate: true,
    },
  },
  methods: {
    onClose() {
      this.$emit('input', false);
    },
    onOpen() {
      this.$emit('input', true);
    },
    onRefresh() {
      this.getCaptcha();
    },
    getCaptcha: throttle(function () {
      const requestId = String(Number(new Date()));
      this.requestId = requestId;
      this.code = '';
      this.pic = API_VERIFICATION.verificationPicGet({ key: requestId });
    }, 3000),
    onSubmit() {
      if (!this.code) {
        this.$toast('请输入图形验证码');
        return;
      }

      this.onClose();
      this.$emit('success', {
        requestId: this.requestId,
        code: this.code,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.captcha {
  &-popup {
    width: 80%;
    border-radius: @border-radius;

    &-close {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: var(--gray-color-6);
      z-index: 20;
    }
  }

  &-header {
    box-sizing: border-box;
    padding: 0 15px;
    width: 100%;
    font-size: 20px;
    // font-weight: bold;
    color: var(--gray-color-8);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    padding: 10px 15px;
  }

  &-code {
    padding: 15px 0 10px;
    display: flex;
    align-items: center;
  }
}

.tips {
  padding: 10px 0 20px 0;
  text-align: right;
  font-size: 12px;
  color: var(--brand-color);
}
</style>
