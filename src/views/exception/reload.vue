<template>
  <div class="container">
    <img :src="image" class="image" />
    <div class="title">页面加载异常或服务器开小差了</div>
    <div class="action button-active" @click="onReload">重新加载</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: require('@/assets/images/exception/reload.png'),
    };
  },
  methods: {
    onReload() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  padding-top: 10vh;
  background: var(--white);
  text-align: center;
}

.image {
  width: 261px;
  height: 143px;
  margin-bottom: 10px;
}

.title {
  color: #999;
  font-size: 14px;
}

.action {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  color: #38f;
}
</style>
