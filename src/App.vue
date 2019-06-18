<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { storage } from "@/common/util";
export default {
  created(){
    console.log(this.$route)
    console.log(this.$root)
  },
  mounted(){
    const token = storage.get('token')
    // this.checkToken(token)
    // console.log(typeof token)
  },
  methods:{
    checkToken(token){
      this.$request.post('/user/check-token', {token}).then(res => {
        if(res.code === 0){
          console.log('有效token')
        }else{
          console.log(res.msg) 
        }
        
      })
    },
  }
}
</script>

<style lang="less">
@import '~@/common/styles/index.css';

body {
  font-size: 16px;
  background-color: #f8f8f8;
  color: #333;
  font-family: 'PingFang SC', Helvetica, 'STHeiti STXihei', 'Microsoft YaHei', Tohoma, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.4;
}
img{
  display: block;
  max-width:100%;
  background:#eee;
}
p{
  margin: 0;
  padding: 0;
}
a{
  color: inherit;
}
/* */
.fz12{
  font-size: 12px;
}
.fz14{
  font-size: 14px;
}
.fz16{
  font-size: 16px;
}
.fz24{
  font-size: 24px;
}
.ml5{
  margin-left: 5px;
}
.mr5{
  margin-right: 5px;
}
.mb10{
  margin-bottom: 10px;
}
.mb20{
  margin-bottom: 20px;
}
.pd50{
  padding-bottom: 50px;
}
.bgf{
  background: #fff;
}
.container-padding{
  margin:15px;
  position: relative;
}
// .disabled{
//   pointer-events: none;
// }
/* common */
.common-h2{
  text-align: center;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  &-title{
    position: relative;
    height:100%;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
  }
  &-title::before{
    content:"";
    background: url(./assets/line_askew.png);
    background-size: cover;
    width: 20px;
    height:6px;
    position: absolute;
    left: -30px;
    top: 25px;
    font-size: 12px;
    color: #666;
  }
  &-title::after{
    content:"";
    background: url(./assets/line_askew.png);
    background-size: cover;
    width: 20px;
    height:6px;
    position: absolute;
    right: -30px;
    top: 25px;
    font-size: 12px;
    color: #666;
  }
}
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

</style>
