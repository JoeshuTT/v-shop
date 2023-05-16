<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { FieldTextAlign } from 'vant';
import { areaList } from '@vant/area-data';

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  code: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '所在地区',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  inputAlign: {
    type: String as PropType<FieldTextAlign>,
    default: 'left',
  },
  border: {
    type: Boolean,
    default: true,
  },
  columnsNum: {
    type: [Number, String],
    default: 3,
  },
});

const emit = defineEmits(['change']);

const showPicker = ref(false);

function onAreaConfirm(values: any) {
  emit('change', values);
  showPicker.value = false;
}

function onPickerToggle() {
  showPicker.value = !showPicker.value;
}
</script>

<template>
  <div class="area-wrapper">
    <van-field
      readonly
      :model-value="modelValue"
      :label="label"
      :placeholder="placeholder"
      is-link
      :input-align="inputAlign"
      :border="border"
      @click="onPickerToggle"
    />
    <!-- 所在地 -->
    <van-popup v-model:show="showPicker" position="bottom">
      <van-area
        :area-list="areaList"
        :columns-num="columnsNum"
        :value="code"
        @cancel="onPickerToggle"
        @confirm="onAreaConfirm"
      />
    </van-popup>
  </div>
</template>
