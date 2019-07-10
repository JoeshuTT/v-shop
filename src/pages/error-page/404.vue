<template>
  <div class="container ui-center">
    <h2>404</h2>
    <p class="ui-c-dark fz14">页面未找到 <router-link to="/" replace >点击返回首页</router-link></p>

  </div>
</template>

<script>
export default {
  name:'Page404',
  data(){
    return {
      error:'页面未找到'
    }
  }
}
</script>

