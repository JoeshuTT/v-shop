<script setup lang="ts">
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  modelValue: [Number, String],
  list: {
    type: Array as PropType<Recordable[]>,
    default: () => [],
  },
  switchable: Boolean,
});

const emit = defineEmits(['select', 'update:modelValue']);

const router = useRouter();

function onSelect(index: number) {
  const item = props.list[index];
  props.list.forEach((_v, i) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.list[i].selected = false;
  });

  // eslint-disable-next-line vue/no-mutating-props
  props.list[index].selected = true;

  emit('select', item, index);
  emit('update:modelValue', item.id);
}

function onDetail(index: number) {
  const { id } = props.list[index];
  router.push({
    path: '/address/edit',
    query: {
      id: id,
    },
  });
}
// eslint-disable-next-line max-params
function formatAddress(provinceStr: string, cityStr: string, areaStr: string, address: string) {
  let str = provinceStr;

  cityStr.length > 1 && (str += cityStr);
  areaStr.length > 1 && (str += areaStr);
  address && (str += ` ${address}`);

  return str;
}
function onItemClicked(index: number) {
  if (props.switchable) {
    onSelect(index);
  } else {
    onDetail(index);
  }
}
</script>

<template>
  <div class="list">
    <div v-for="(item, index) in list" :key="item.id" class="list-item" @click="onItemClicked(index)">
      <div v-if="switchable" class="list-item-hd">
        <van-checkbox :model-value="modelValue === item.id" />
      </div>
      <div class="list-item-bd">
        <div class="list-item-name">
          {{ item.linkMan }} {{ item.mobile }}
          <span v-if="item.isDefault" class="list-item-tag">默认</span>
        </div>
        <div class="list-item-address">
          {{ formatAddress(item.provinceStr, item.cityStr, item.areaStr, item.address) }}
        </div>
      </div>
      <div class="list-item-ft" @click.stop="onDetail(index)">
        <van-icon name="edit" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: var(--color-bg-2);
  border-radius: 8px;
  margin-bottom: 10px;

  &-hd {
    padding-right: 10px;
    display: flex;
    justify-content: center;
  }

  &-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0 4px;
    color: #fff;
    font-size: 10px;
    line-height: 14px;
    margin-left: 8px;
    border-radius: 999px;
    background-color: var(--color-primary);
  }

  &-name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 16px;
    line-height: 22px;
  }

  &-address {
    color: var(--color-text-1);
    font-size: 13px;
    line-height: 18px;
  }

  &-bd {
    flex: 1;
  }

  &-ft {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
  }
}
</style>
