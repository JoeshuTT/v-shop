<template>
  <div class="area-wrapper">
    <van-field
      readonly
      :value="value"
      :label="label"
      :placeholder="placeholder"
      is-link
      :input-align="inputAlign"
      :border="border"
      @click="showPicker = true"
    />
    <!-- 所在地 -->
    <van-popup v-model="showPicker" position="bottom">
      <van-area
        :area-list="areaList"
        :columns-num="columnsNum"
        :value="code"
        @cancel="showPicker = false"
        @confirm="onAreaConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { areaList } from '@vant/area-data';

export default {
  props: {
    value: {
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
      type: String,
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
  },
  data() {
    return {
      showPicker: false,
      areaList,
    };
  },
  methods: {
    onAreaConfirm(values) {
      this.$emit('change', values);
      this.showPicker = false;
    },
  },
};
</script>
