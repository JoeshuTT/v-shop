<script setup lang="ts">
import { onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import API_USER from '@/apis/user';
import AddressList from '@/components/AddressList/index.vue';

defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'select']);

const router = useRouter();

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'max-height': '80%',
  'min-height': '50%',
  'overflow-y': 'visible',
  'font-size': '14px',
};

const list = ref<Recordable[]>([]);
const listLoading = ref(false);
const addressId = ref('');

onMounted(() => {
  getList();
});

function onSelect(item: Recordable, index: number) {
  emit('select', item, index);
  close();
}

function getList() {
  listLoading.value = true;

  API_USER.userShoppingAddressList()
    .then((res) => {
      list.value = res.data?.result ?? [];

      if (unref(list).length) {
        addressId.value = unref(list)[0].id;
      }
    })
    .finally(() => {
      listLoading.value = false;
    });
}

function onSubmit() {
  router.push({ path: '/address', query: { origin: 'selected' } });
}

function close() {
  updateShow(false);
}

function open() {
  updateShow(true);
}

function updateShow(value: boolean) {
  emit('update:modelValue', value);
}

defineExpose({
  open,
  close,
  updateShow,
});
</script>

<template>
  <van-popup :show="modelValue" round closeable position="bottom" :style="popupStyle" @update:show="updateShow">
    <div class="address-header">选择收货地址</div>
    <div class="address-body">
      <AddressList
        v-if="list.length"
        v-model="addressId"
        class="address-list"
        switchable
        :list="list"
        @select="onSelect"
      />
    </div>
    <div class="address-actions">
      <van-button type="primary" round block @click="onSubmit">新增地址</van-button>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.address {
  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: var(--color-text-1);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    min-height: 40vh;
    max-height: 80vh;
    overflow-y: auto;
    background: var(--color-bg-1);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  &-list {
    margin: 12px 12px 80px;
  }

  &-actions {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}
</style>
