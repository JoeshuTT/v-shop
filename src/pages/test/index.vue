<template>
  <div class="container">
     <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <van-cell
    v-for="item in list"
    :key="item"
    :title="item"
  />
</van-list>
  </div>
</template>

<script>
import { List } from 'vant'

export default {
  components: {
    [List.name]: List
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },
  created() {
    // this.getPintuanJoiner(this.$route.query.id)

  },
  methods: {
    onLoad() {
      console.log(1)
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        // if (this.list.length >= 40) {
        this.finished = true
        // }
      }, 500)
    }
  }
}
</script>
<style lang="less" scoped>

  .list{
    &-item{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: #fff;
      padding:10px 15px;
      &-media{
        width:50px;
        height:50px;
        border-radius:50%;
        overflow:hidden;
        margin-right: 10px;
      }
      &-inner{
        flex: 1;
      }
      &-title{
        font-size: 14px;
        color: #333;
        margin-bottom:10px;
      }
      &-txt{
        font-size: 12px;
        color: #666;
      }
    }
  }
  .no-data{
    font-size: 14px;
    color:#999;
    text-align:center;
    padding:20px 0;
  }
</style>

