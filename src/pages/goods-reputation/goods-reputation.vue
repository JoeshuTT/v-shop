<template>
  <div class="contaienr">
    <div class="list">
      <div class="list-item mb10" v-for="item in list" :key="item.id">
        <div class="list-item-header van-hairline--bottom">
          <div class="list-item-avatar"><img :src="item.avatarUrl" alt=""></div>
          <div class="list-item-inner">
            <div class="list-item-name">{{item.nickName}}</div>
            <div class="list-item-star">
              <van-rate v-model="item.rate"
                :size="14"
                color="#f44"
                void-icon="star"
                void-color="#eee"
                readonly />
            </div>
          </div>
          <div class="list-item-date">{{item.date}}</div>
        </div>
        <div class="list-item-content"><p>{{item.remark}}</p><p class="fz12">{{item.property}}</p></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Rate } from 'vant'
// import { storage } from '@/common/util'

export default {
  components: {
    [Rate.name]: Rate
  },
  data() {
    return {
      list: [],
      noTips: '您还没有评价信息'
    }
  },
  created() {
    this.getGoodsReputation(this.$route.query.id)
  },
  methods: {
    rate2star(rateValue) {
      let value = 5
      switch (rateValue) {
        case 0:
          value = 1
          break
        case 1:
          value = 3
          break
        case 2:
          value = 5
          break
        default:
          value = 5
      }
      return value
    },
    getGoodsReputation(goodsId, page = 1, pageSize = 50) {
      this.$request.post('/shop/goods/reputation', { goodsId, page, pageSize }).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.list = res.data.map(item => ({
          id: item.goods.id,
          avatarUrl: item.user.avatarUrl || `${require('@/assets/avatar_default.png')}`,
          nickName: item.user.nickName || item.user.mobile.replace(item.user.mobile.substring(3, 7), '****'),
          rate: this.rate2star(item.goods.goodReputationStr),
          remark: item.goods.goodReputationRemark || '此用户没有填写评价',
          date: item.goods.dateReputation.slice(0, 10),
          property: item.goods.property
        }))
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list-item{
  background:#fff;
  &-avatar{
    width:40px;
    height:40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right:5px;
  }
  &-name{
    font-size: 14px;
    color:#555;
    line-height: 1;
  }
  &-inner{
    flex:1;
    padding-top:4px;
  }
  &-date{
    font-size: 12px;
    color:#999;
  }
  &-header{
    padding:10px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  &-content{
    padding:10px 15px;
    color:#999;
    font-size: 14px;
  }
}

.no-data {
  font-size: 16px;
  color: #999;
  text-align: center;
  padding-top: 150px;
}
</style>

