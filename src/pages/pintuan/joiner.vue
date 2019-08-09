<template>
  <div class="container">
     <div class="list" v-if="joiners.length">
       <div class="list-item van-hairline--bottom" v-for="(item,index) in joiners" :key="index">
         <div class="list-item-media"><img :src="item.avatarUrl" alt="" srcset=""></div>
         <div class="list-item-inner">
           <div class="list-item-title">{{item.nick}} <van-tag v-if="index === 0" round type="danger">团长</van-tag></div>
           <div class="list-item-txt">{{item.dateAdd}} 开团</div>
         </div>
       </div>
     </div>
     <div class="no-data" v-else>暂无数据</div>
  </div>
</template>

<script>
import { Tag } from 'vant'

export default {
  components: {
    [Tag.name]: Tag
  },
  data() {
    return {
      joiners: []
    }
  },
  created() {
    this.getPintuanJoiner(this.$route.query.id)
  },
  methods: {
    getPintuanJoiner(tuanId) {
      this.$request.get('/shop/goods/pingtuan/joiner', { tuanId }).then(res => {
        if (res.code !== 0) {
          // this.$toast(res.msg)
          // 拼团只有处在进行中才会返回相关数据
          this.$dialog.confirm({
            title: '提示',
            message: `${res.msg}`,
            showCancelButton: false,
            confirmButtonText: '进店逛逛'
          }).then(() => {
            // on confirm
            this.$router.replace({ path: '/home' })
          })
          return
        }

        this.joiners = res.data.map(item => ({
          nick: item.apiExtUserHelp.nick || '神秘用户',
          avatarUrl: item.apiExtUserHelp.avatarUrl || `${require('@/assets/avatar_default.png')}`,
          dateAdd: item.dateAdd,
          uidHelp: item.uidHelp
        })).reverse()
      })
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

