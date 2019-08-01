<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
@import "~@styles/index.css";
// @import '~@styles/variables.less';

body {
  font-family: "PingFang SC", Helvetica, "STHeiti STXihei", "Microsoft YaHei", Tohoma, Arial, sans-serif;
  background-color: #f8f8f8;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  min-width: 320PX;
  max-width: 750PX;
  margin-left: auto;
  margin-right: auto;
}
img {
  display: block;
  max-width: 100%;
  background: #eee;
  border: 0 none;
}
p {
  margin: 0;
}
a {
  color: inherit;
}
// 只适用于页面里只含有一种类型的按钮的情况下
// [class^="btn"]:active{
//   opacity: .8;
// }
.btn-area:active,.btn-fav:active,.btn-danger:active,.btn-warning:active,.btn-gray:active{
  opacity: .8;
}
/* */
.fz12 {
  font-size: 12px;
}
.fz14 {
  font-size: 14px;
}
.fz16 {
  font-size: 16px;
}
.fz18 {
  font-size: 18px;
}
.fz24 {
  font-size: 24px;
}
.ml5 {
  margin-left: 5px;
}
.ml10 {
  margin-left: 10px;
}
.ml20 {
  margin-left: 20px;
}
.mr5 {
  margin-right: 5px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
.pd50 {
  padding-bottom: 50px;
}
.pd100 {
  padding-bottom: 100px;
}
.bgf {
  background: #fff;
}
.container-padding {
  margin: 15px;
  position: relative;
}
// .disabled{
//   pointer-events: none;
// }
/* common */
.copyright{
  color:#999;
  font-size: 14px;
  line-height:2;
  text-align:center;
}
.common-h2 {
  text-align: center;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  &-title {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
  }
  &-title::before {
    content: "";
    background: url(./assets/line_askew.png);
    background-size: cover;
    width: 20px;
    height: 6px;
    position: absolute;
    left: -30px;
    top: 25px;
    font-size: 12px;
    color: #666;
  }
  &-title::after {
    content: "";
    background: url(./assets/line_askew.png);
    background-size: cover;
    width: 20px;
    height: 6px;
    position: absolute;
    right: -30px;
    top: 25px;
    font-size: 12px;
    color: #666;
  }
}
</style>
