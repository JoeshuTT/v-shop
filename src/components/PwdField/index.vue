<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PwdField',
  setup() {
    const eye = ref(false);

    function onSwitch() {
      eye.value = !eye.value;
    }

    return {
      eye,
      onSwitch,
    };
  },
});
</script>

<template>
  <van-field :type="eye ? 'text' : 'password'">
    <template #right-icon>
      <van-icon :name="eye ? 'eye-o' : 'closed-eye'" @click="onSwitch" />
    </template>
  </van-field>
</template>
