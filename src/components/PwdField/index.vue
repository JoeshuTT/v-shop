<template>
  <van-field v-bind="$attrs" :value="value" :type="eye ? 'text' : 'password'" @input="onInput">
    <template #right-icon>
      <van-icon :name="eye ? 'eye-o' : 'closed-eye'" @click="onSwitch" />
    </template>
  </van-field>
</template>

<script>
export default {
  props: {
    value: [Number, String],
  },
  data() {
    return {
      eye: false,
    };
  },
  methods: {
    onSwitch() {
      this.eye = !this.eye;
    },
    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>
