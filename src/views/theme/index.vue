<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { palettes } from '@/constants/modules/app';

import { useAppStore } from '@/store/modules/app';
import { usePage } from '@/hooks/shared/usePage';
import { getAssetsUrl } from '@/utils';

const router = useRouter();
const appStore = useAppStore();
const { theme } = usePage();

const modeList = ref<Recordable[]>([
  {
    value: 'light',
    label: '浅色',
    pic: getAssetsUrl('images/theme/light.svg'),
  },
  {
    value: 'dark',
    label: '深色',
    pic: getAssetsUrl('images/theme/dark.svg'),
  },
  {
    value: 'system',
    label: '系统',
    pic: getAssetsUrl('images/theme/system.svg'),
  },
]);

function onThemeModeChange(value: string) {
  appStore.updateTheme({
    mode: value,
  });
}

const list = ref<Recordable[]>(
  palettes.map((v) => ({
    ...v,
    colorList: [v.colors.primary, v.colors.vice, '#fff'],
  })),
);
const active = ref(-1);
active.value = unref(list).findIndex((v) => v.value === unref(theme).colors.primary);
const current = computed(() => unref(list)[unref(active)] || {});

function onThemeColorChange(index: number) {
  active.value = index;
  const { colors } = unref(list)[unref(active)];
  appStore.updateTheme({ colors });
}

function onSubmit() {
  router.back();
}
</script>

<template>
  <div class="container">
    <div class="h2">选择主题</div>
    <div class="mode-list">
      <div
        v-for="(item, index) in modeList"
        :key="index"
        :class="['mode-item', theme.mode === item.value ? 'active' : '']"
        @click="onThemeModeChange(item.value)"
      >
        <img class="mode-item-pic" :src="item.pic" :alt="item.label" />
        <span class="mode-item-title">
          {{ item.label }}
        </span>
      </div>
    </div>
    <div class="h2">选择配色</div>
    <div class="color-list">
      <van-cell v-for="(item, index) in list" :key="index" :title="item.label" @click="onThemeColorChange(index)">
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
      </div>
    </div>

    <AffixBar>
      <van-button class="submit-bar-button" block type="primary" round :color="current.value" @click="onSubmit">
        返回
      </van-button>
    </AffixBar>
  </div>
</template>

<style lang="less" scoped>
.mode {
  &-list {
    display: flex;
    margin: 0 15px;
    overflow: hidden;
    border-radius: 8px;
    background: var(--color-bg-2);
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    color: var(--color-text-1);
    padding: 10px 15px;

    &.active &-pic {
      box-shadow: var(--color-white) 0 0 0 1px, var(--color-primary) 0 0 0 5px;
    }

    &-pic {
      box-sizing: border-box;
      width: 20vw;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.3s;
      overflow: hidden;
      margin-bottom: 10px;
    }
  }
}

.color-list {
  margin: 0 15px;
  overflow: hidden;
  border-radius: 8px;
}

.h2 {
  margin: 0;
  padding: 15px 15px 10px;
  color: var(--color-text-3);
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}

.color {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border-2);
  transition: all 0.3s;

  &-item {
    width: 16px;
    height: 16px;
  }

  &.active {
    box-shadow: var(--color-white) 0px 0px 0px 1px, var(--color-primary) 0px 0px 0px 5px;
  }
}

.tips {
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 12px;
  line-height: 16px;
  color: var(--color-text-3);
}

.submit-bar {
  &-button {
    width: 80%;
    height: 34px;
    letter-spacing: 2px;
  }
}
</style>
