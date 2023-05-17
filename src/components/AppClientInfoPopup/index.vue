<script lang="ts">
export default {
  name: 'AppClientInfoPopup',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { Popup as VanPopup } from 'vant';
import { getClientInfo } from '@/utils';

defineProps({
  show: Boolean,
});
const emit = defineEmits(['update:show']);

const clientInfo = getClientInfo();
const infoList = ref(
  Object.keys(clientInfo).map((k) => ({
    label: k,
    value: clientInfo[k],
  })),
);

function updateShow(value: boolean) {
  emit('update:show', value);
}
</script>

<template>
  <van-popup
    :show="show"
    round
    style="
       {
        width: 80%;
      }
    "
    @update:show="updateShow"
  >
    <div class="header">
      <div class="header-title">我的设备</div>
    </div>
    <div class="info scroller-y">
      <div v-for="(item, index) in infoList" :key="index" class="info-p">
        <div class="info-p-label">{{ item.label }}</div>
        <div class="info-p-value">{{ item?.value ?? '-' }}</div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0 5px;
  font-size: 18px;
  color: #080808;

  &-title {
    margin-bottom: 10px;
  }
}

.info {
  box-sizing: border-box;
  padding: 10px 20px;
  border-top: 1px solid var(--color-border-2);
  height: 60vh;

  &-p {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-text-1);
    margin-bottom: 10px;

    &-label {
      margin-right: 10px;
      color: var(--color-text-3);
    }

    &-value {
      flex: 1;
      display: flex;
      align-items: center;
      word-break: break-all;
    }
  }
}

.dark {
  .header {
    color: var(--color-text-1);
  }
}
</style>
