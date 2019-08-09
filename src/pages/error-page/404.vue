<template>
  <div class="container ui-center">
    <h2>o(╥﹏╥)o</h2>
    <h1>404</h1>
    <p class="ui-c-dark fz14">页面找不到了 </p>
    <p> <router-link to="/" replace >返回首页</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  data() {
    return {
      error: '页面未找到'
    }
  }
}
</script>

