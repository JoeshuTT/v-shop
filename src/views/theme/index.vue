<script lang="ts" setup>
import { computed, onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { palettes } from '@/constants/modules/app';

import { useAppStore } from '@/store/modules/app';
import { usePage } from '@/hooks/shared/usePage';

onMounted(() => {
  list.value = palettes.map((v) => ({
    ...v,
    colorList: [v.colors.brandColor, v.colors.viceColor, '#fff'],
  }));

  active.value = unref(list).findIndex((v) => v.value === unref(theme).brandColor);
});

const router = useRouter();
const appStore = useAppStore();
const { theme } = usePage();

const list = ref<Recordable[]>([]);
const active = ref(-1);

const current = computed(() => unref(list)[unref(active)] || {});

function onThemeChange(index: number) {
  active.value = index;
}

function onSubmit() {
  const { colors } = unref(list)[unref(active)];
  appStore.updateTheme({ colors });
  router.back();
}
</script>

<template>
  <div class="container">
    <div class="h2">选择配色</div>
    <div class="palettes">
      <van-cell v-for="(item, index) in list" :key="index" :title="item.label" @click="onThemeChange(index)">
        <template #label>
          <div :class="['color', active === index ? 'active' : '']">
            <div
              v-for="(color, colorIndex) in item.colorList"
              :key="colorIndex"
              class="color-item"
              :style="{ background: color }"
            ></div>
          </div>
        </template>
      </van-cell>
      <div class="tips">
        <div class="tips-h2">tips：</div>
        <div>1. 商品详情页面可查看最佳效果。</div>
        <div>2. 只在当前页面生效，如果需要持久化生效，请点击底部按钮【保存】即可。</div>
      </div>
    </div>

    <div class="submit-bar-wrap">
      <div class="submit-bar">
        <van-button class="submit-bar-button" block type="primary" round :color="current.value" @click="onSubmit">
          保存
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.global-themes {
  margin-top: 5px;
  margin-left: -3px;
  width: 370px;
}

.global-themes .theme-item {
  float: left;
  padding: 2px;
  margin: 0 20px 5px 0;
  height: 16px;
  border: 1px solid #fff;
  cursor: pointer;
}

.global-themes .theme-item.active {
  border: 1px solid #0080f9;
}

.global-themes .theme-item .color-item {
  display: inline-block;
  width: 16px;
  height: 16px;
}

.affix-bar {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));

  &-action {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    box-sizing: content-box;
    height: 50px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background-color: var(--white);

    .van-button {
      flex: 1;
    }
  }
}

.tips {
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 12px;
  line-height: 16px;
  color: var(--gray-color-6);
}

.palettes {
  margin: 0 15px;
  overflow: hidden;
  border-radius: 8px;
}

.h2 {
  margin: 0;
  padding: 15px 15px 10px;
  color: var(--gray-color-6);
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}

.color {
  display: inline-flex;
  align-items: center;
  border: 1px solid #eee;

  &-item {
    width: 16px;
    height: 16px;
  }

  &.active {
    border: 1px solid #0080f9;
  }
}

.submit-bar {
  &-wrap {
    height: calc(50px + constant(safe-area-inset-bottom));
    height: calc(50px + env(safe-area-inset-bottom));
  }

  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  z-index: 100;
  width: 100%;
  padding: 0 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 14px;

  &-button {
    width: 80%;
    height: 34px;
    letter-spacing: 2px;
  }
}
</style>
