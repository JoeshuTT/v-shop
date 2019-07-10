<template>
    <div class="container pd50">
      <div class="user-header">
        <div class="user-hd">
          <img class="user-avatar" :src="userInfo.avatarUrl" alt="">
        </div>
        <div class="user-bd">
          <div class="user-bd-title">{{userInfo.nick}}</div>
          <div class="user-bd-txt">可用余额{{balance | formatYuan}}元,剩余积分{{score}}</div>
        </div>
        <div class="user-ft">
          <router-link to="/setting" class="user-ft-right"><van-icon name="arrow" /></router-link>
        </div>
      </div>
      <div class="user-main">
        <div class="user-section">
          <router-link :to="'/order-list'" class="user-section-hd van-hairline--bottom"><div class="user-section-title">全部订单</div> <van-icon class="ml5" name="arrow" /></router-link>
          <div class="user-section-bd ui-clearfix">
            <router-link :to="'/order-list?status=0'" class="user-section-grid"><van-icon name="pending-payment" :info="count.count_id_no_pay" /><div class="user-section-grid-title">待付款</div></router-link>
            <router-link :to="'/order-list?status=1'" class="user-section-grid"><van-icon name="tosend" :info="count.count_id_no_transfer" /><div class="user-section-grid-title">待发货</div></router-link>
            <router-link :to="'/order-list?status=2'" class="user-section-grid"><van-icon name="logistics" :info="count.count_id_no_confirm" /><div class="user-section-grid-title">待收货</div></router-link>
            <router-link :to="'/order-list?status=3'" class="user-section-grid"><van-icon name="comment-o" :info="count.count_id_no_reputation" /><div class="user-section-grid-title">评价</div></router-link>
            <router-link to="/refund" class="user-section-grid"><van-icon name="after-sale" /><div class="user-section-grid-title">退款/售后</div></router-link>
          </div>
        </div>
        <!-- <div class="user-section">
          <div class="user-section-hd van-hairline--bottom"><div class="user-section-title">我的钱包</div>  </div>
          <div class="user-section-bd ui-clearfix">
            <div class="user-section-grid"><span class="fz12">可用余额(元)</span><div class="user-section-grid-title">{{balance | formatYuan}}</div></div>
            <div class="user-section-grid"><span class="fz12">冻结金额(元)</span><div class="user-section-grid-title">{{freeze | formatYuan}}</div></div>
            <div class="user-section-grid"><span class="fz12">剩余积分</span><div class="user-section-grid-title">{{score}}</div></div>
            <div class="user-section-grid"><span class="fz12">累计消费(元)</span><div class="user-section-grid-title">{{totleConsumed | formatYuan}}</div></div>
          </div>
        </div> -->
        <div class="user-gruop">
          <van-cell value="常用" class="mb10" />
            <van-row>
              <!-- <van-col span="6" class="ui-center"><router-link :to="'/coupons'"><van-icon name="smile-comment-o" size="24"/><div class="user-gruop-name">我的消息</div></router-link></van-col>  -->
              <van-col span="6" class="ui-center"><router-link :to="'/cashlog'"><van-icon name="balance-o" size="24" /><div class="user-gruop-name">资金明细</div></router-link></van-col> 
              <van-col span="6" class="ui-center"><router-link :to="'/favgoods'"><van-icon name="star-o" size="24" /><div class="user-gruop-name">我的收藏</div></router-link></van-col> 
              <!-- <van-col span="6" class="ui-center"><van-icon name="comment-o" size="24" /><div class="user-gruop-name">我的评价</div></router-link></van-col>  -->
              <van-col span="6" class="ui-center"><router-link :to="'/coupons'"><van-icon name="coupon-o" size="24" /><div class="user-gruop-name">优惠券</div></router-link></van-col> 
              <van-col span="6" class="ui-center"><router-link :to="'/address-list'"><van-icon name="location-o" size="24" /><div class="user-gruop-name">收货地址</div></router-link></van-col> 
              <van-col span="6" class="ui-center"><router-link :to="'/setting'"><van-icon name="setting-o" size="24" /><div class="user-gruop-name">设置</div></router-link></van-col> 
            </van-row>  
        </div>
        <div class="user-gruop">
          <!-- <van-cell title="关于" is-link /> -->
          <van-cell title="关于" @click="onShowAbout" />
          <van-cell title="日志" is-link />
        </div>
      </div>
      <!-- 底部导航栏 -->
      <van-tabbar route v-model="active" active-color="#f44">
  <van-tabbar-item
    replace
    to="/home"
    icon="home-o"
  >
    首页
  </van-tabbar-item>
  <van-tabbar-item
    replace
    to="/cart"
    icon="cart-o"
  >
    购物车
  </van-tabbar-item>
  <van-tabbar-item
    replace
    to="/user"
    icon="manager-o"
  >
    我的
  </van-tabbar-item>
</van-tabbar>
    </div>
</template>
<script>
import { Tabbar, TabbarItem,} from 'vant'
import util from '@/common/util'

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  data() {
    return {
      userInfo:{},
      active:0,
      balance: 0, 
      freeze: 0, 
      score: 0, 
      totleConsumed: 0, 
      count:{},  // 订单统计
    }
  },
  filters:{
    formatYuan(value){
      return parseInt(value).toFixed(2)
    }
  },
  created() {
    this.getUserAmount()
    this.getUserInfo()
    this.getOrderCount()
  },
  methods: {
    getUserInfo(){
      this.$request.get('/user/detail',{token:util.storage.get('token')}).then(res=>{
        if (res.code !== 0) {
          return;
        }
        const baseInfo = res.data.base
        this.userInfo = {
          ...res.data.base,
          avatarUrl:baseInfo.avatarUrl || `${require('@/assets/avatar_default.png')}`,
          nick:baseInfo.nick || `${baseInfo.sourceStr}${baseInfo.id}`,
          mobile:baseInfo.mobile||'',
        } 
        this.$store.commit('updateUserInfo',this.userInfo)
      })
      
    },
    getOrderCount(){
      this.$request.get('/order/statistics',{token:util.storage.get('token')}).then(res=>{
        if (res.code !== 0) {
          return;
        }
        this.count = res.data
        for (let filed in this.count) { 
          this.count[filed] = this.count[filed] || ''  // 为0时角标不显示
        }
      })
    },
    getUserAmount(){
      this.$request.get('/user/amount',{token:util.storage.get('token')}).then(res=>{
        if (res.code !== 0) {
          return;
        }
        this.balance = res.data.balance
        this.freeze = res.data.freeze
        this.score = res.data.score
        this.totleConsumed = res.data.totleConsumed
      })
    },
    onShowAbout(){
      this.$dialog.alert({
        // title: '标题',
        message: this.$store.state.globalData.desc
      }).then(() => {
        // on close
      });
    }
  }
}
</script>
<style lang="less" scopde>
  .user-header{
    box-sizing: border-box;
    width: 100%; 
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height:180px;
    color: #fff; 
    padding: 0 15px;
    // background-color: #fe4140;
    background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);

  }
  .user-hd{
    margin-right: 10px;
  }
  .user-bd{
    padding-top:4px;
    &-title{
      font-size: 20px;
    }
    &-txt{
      font-size: 14px;
    }
  }
  .user-hd{
    margin-right: 10px;
  }
  .user-avatar{
    width:60px;
    height:60px;
    border-radius:50%;
    background: #eee;
    overflow: hidden;
  }
  .user-bd{
    flex: 1;
  }
  .user-main{
    // padding:0 20px;
    margin-top: -40px;
  }
  .user-gruop{
    box-sizing: border-box;
    border-radius:8px;
    margin:0 15px 20px 15px;
    overflow: hidden;
    background:#fff;
    &-name{
      // padding: 10px 0;
      color: #333;
      font-size: 12px;
      margin-bottom:10px;
    }
  }
  .user-section{
    box-sizing: border-box;
    border-radius:8px;
    overflow: hidden;
    background:#fff;
    margin:0 20px 15px 20px;
    padding:0 15px;
    min-height:100px;
    &-title{
      font-size: 14px;
      color: #000;
      font-weight: bold;
    }
    &-hd{
      box-sizing: border-box;
      width: 100%;
      padding: 10px 0px;
      overflow: hidden;
      color: #323233;
      font-size: 14px;
      line-height: 24px;
      background-color: #fff;
      display: flex;
      align-items: center;
    }
    &-bd{
      box-sizing: border-box;
      margin-left: -20px;
      margin-right: -20px;
      // width:100%;
      padding: 20px 10px;
    }
    &-grid{
      box-sizing: border-box;
      width:20%;
      float: left;
      text-align: center;
      .van-icon{
        font-size: 24px;
      }
      &-img{
        display: inline-block;
        width:30px;
        height:30px;
        // margin-bottom: 5px;
      }
      &-title{
        padding: 10px 0;
        color: #333;
        font-size: 12px;
      }
    }
  }
  // 
  .user-row{
    box-sizing: border-box;
    border-radius:8px;
    overflow: hidden;
    background:#fff;
    margin:15px 20px;
  }
</style>



