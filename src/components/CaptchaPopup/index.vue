<script lang="ts">
export default {
  name: 'Captcha',
};
</script>
<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue';
import { showToast } from 'vant';
import { rpx2px, throttle } from '@/utils';
import API_VERIFICATION from '@/apis/verification';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['confirm', 'update:show']);

const popupStyle = {
  width: '80%',
  'border-radius': '4px',
};
const requestId = ref('');
const pic = ref('');
const code = ref('');
const codeWidth = rpx2px(150);

const submitted = computed(() => {
  return unref(code).length;
});

function onRefresh() {
  getCaptcha();
}

const getCaptcha = throttle(() => {
  const requestTimeStamp = `${Date.now()}`;
  requestId.value = requestTimeStamp;
  code.value = '';
  pic.value = API_VERIFICATION.verificationPicGet({ key: requestTimeStamp });
}, 3000);

function onSubmit() {
  if (!unref(code)) {
    showToast('请输入图形验证码');
    return;
  }

  emit('confirm', {
    requestId: unref(requestId),
    code: unref(code),
  });
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      onRefresh();
    }
  },
);

function open() {
  updateShow(true);
}
function close() {
  updateShow(false);
}

function updateShow(value: boolean) {
  emit('update:show', value);
}

defineExpose({
  open,
  close,
  updateShow,
});
</script>

<template>
  <van-popup :show="show" position="center" teleport="body" :style="popupStyle" @update:show="updateShow">
    <div class="captcha-popup-close" @click="close">
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
            :style="[{ width: codeWidth + 'px', background: '#eee' }]"
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

<style lang="less" scoped>
.captcha {
  &-popup {
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
      color: var(--color-text-2);
      z-index: 20;
    }
  }

  &-header {
    box-sizing: border-box;
    padding: 0 15px;
    width: 100%;
    font-size: 20px;
    // font-weight: bold;
    color: var(--color-text-1);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    padding: 10px 15px;
  }

  &-img {
    aspect-ratio: 4;
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
  color: var(--color-primary);
}
</style>
