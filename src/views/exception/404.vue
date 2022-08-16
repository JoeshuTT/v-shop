<template>
  <div class="container">
    <van-empty :image="image" description="对不起，你访问的页面已被删除或不存在。">
      <van-button @click="goHome">去首页</van-button>
    </van-empty>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: require('@/assets/images/exception/404.png'),
    };
  },
  methods: {
    goHome() {
      this.$router.replace('/home');
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  background: var(--white);
}
</style>
