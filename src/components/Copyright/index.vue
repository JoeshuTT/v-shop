<template>
  <div class="copyright">
    <div class="copyright-p">
      <a href="https://github.com/JoeshuTT/v-shop" target="_blank">Copyright © 2019-2022 v-shop | v2 </a>
    </div>
    <div class="copyright-p">最后发布时间：{{ appVersion }}</div>
  </div>
</template>

<script>
import { version } from '../../../package.json';

export default {
  data() {
    return {
      version,
      appVersion: process.env.APP_VERSION,
    };
  },
};
</script>

<style lang="less" scoped>
.copyright {
  padding: 20px 0 10px;
  color: var(--gray-color-6);
  font-size: 12px;
  text-align: center;
  line-height: 18px;

  a {
    color: var(--gray-color-6);
  }
}
</style>
