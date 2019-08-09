<template>
  <div class="container pd50">
    <div class="header mb20">
      <div class="header-media">
        <img class="user-avatar" :src="userInfo.avatarUrl" alt="">
      </div>
      <div class="header-title">
        {{userInfo.nick}}
      </div>
      <div class="header-setting" @click="onSettingClick">
        <van-icon name="setting-o" />
      </div>
    </div>
    <div class="main">
      <div class="group balance-group">
        <van-cell value="我的钱包" />
        <van-row class="group-inner">
          <van-col span="6">
            <div class="balance-group-title">{{balance | formatYuan}}</div>
            <div class="balance-group-txt">可用余额(元)</div>
          </van-col>
          <van-col span="6">
            <div class="balance-group-title">{{freeze | formatYuan}}</div>
            <div class="balance-group-txt">冻结金额(元)</div>
          </van-col>
          <van-col span="6">
            <div class="balance-group-title">{{score}}</div>
            <div class="balance-group-txt">剩余积分(元)</div>
          </van-col>
          <van-col span="6">
            <div class="balance-group-title">{{totleConsumed | formatYuan}}</div>
            <div class="balance-group-txt">累计消费(元)</div>
          </van-col>
        </van-row>
      </div>
      <div class="group order-group">
        <van-cell
          title="我的订单"
          value="查看全部订单"
          to="/order-list"
          is-link />
        <div class="user-section-bd ui-clearfix">
          <router-link :to="'/order-list?status=0'"
            class="user-section-grid">
            <van-icon name="pending-payment"
              :info="count.count_id_no_pay" />
            <div class="user-section-grid-title">待付款</div>
          </router-link>
          <router-link :to="'/order-list?status=1'"
            class="user-section-grid">
            <van-icon name="tosend"
              :info="count.count_id_no_transfer" />
            <div class="user-section-grid-title">待发货</div>
          </router-link>
          <router-link :to="'/order-list?status=2'"
            class="user-section-grid">
            <van-icon name="logistics"
              :info="count.count_id_no_confirm" />
            <div class="user-section-grid-title">待收货</div>
          </router-link>
          <router-link :to="'/order-list?status=3'"
            class="user-section-grid">
            <van-icon name="comment-o"
              :info="count.count_id_no_reputation" />
            <div class="user-section-grid-title">评价</div>
          </router-link>
          <router-link to="/refund"
            class="user-section-grid">
            <van-icon name="after-sale" />
            <div class="user-section-grid-title">退款/售后</div>
          </router-link>
        </div>
      </div>
      <div class="group changy-group">
        <van-cell value="我的工具" class="mb10" />
        <van-grid :border="false" :column-num="4">
          <van-grid-item
            v-for="(item,index) in tools"
            :key="index"
            :icon="item.icon"
            :text="item.title"
            :to="item.path"
          />
        </van-grid>
      </div>
      <div class="group about-group">
        <van-row class="group-inner">
        <!-- <van-cell title="关于" is-link /> -->
        <van-cell title="关于"
          @click="onShowAbout" />
        <van-cell title="日志"
          is-link />
          </van-row>
      </div>
    </div>
    <div class="copyright">copyright@<a href="https://github.com/JoeshuTT/v-shop">JoeshuT.T v-shop</a></div>
    <!-- 底部导航栏 -->
    <van-tabbar route
      v-model="active"
      active-color="#f44">
      <van-tabbar-item replace
        to="/home"
        icon="home-o">
        首页
      </van-tabbar-item>
      <van-tabbar-item replace
        to="/cart"
        icon="cart-o">
        购物车
      </van-tabbar-item>
      <van-tabbar-item replace
        to="/user"
        icon="manager-o">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem, Grid, GridItem } from 'vant'
import util from '@/common/util'

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  data() {
    return {
      userInfo: {},
      active: 0,
      balance: 0,
      freeze: 0,
      score: 0,
      totleConsumed: 0,
      count: {}, // 订单统计
      tools: [
        { icon: 'balance-o', title: '资金明细', path: '/cashlog' },
        { icon: 'star-o', title: '我的收藏', path: '/favgoods' },
        // {icon:'comment-o',title:'我的评价',path:'/favgoods'},
        { icon: 'coupon-o', title: '优惠券', path: '/coupons' },
        { icon: 'location-o', title: '收货地址', path: '/address-list' },
        { icon: 'setting-o', title: '设置', path: '/setting' }
      ]
    }
  },
  filters: {
    formatYuan(value) {
      return parseInt(value).toFixed(2)
    }
  },
  created() {
    this.getUserAmount()
    this.getUserInfo()
    this.getOrderCount()
  },
  methods: {
    getUserInfo() {
      this.$request.get('/user/detail', { token: util.storage.get('token') }).then(res => {
        if (res.code !== 0) {
          return
        }
        const baseInfo = res.data.base
        this.userInfo = {
          ...res.data.base,
          avatarUrl: baseInfo.avatarUrl || `${require('@/assets/avatar_default.png')}`,
          nick: baseInfo.nick || `${baseInfo.sourceStr}${baseInfo.id}`,
          mobile: baseInfo.mobile || ''
        }
        this.$store.commit('updateUserInfo', this.userInfo)
      })
    },
    getOrderCount() {
      this.$request.get('/order/statistics', { token: util.storage.get('token') }).then(res => {
        if (res.code !== 0) {
          return
        }
        this.count = res.data
        for (const filed in this.count) {
          this.count[filed] = this.count[filed] || '' // 为0时角标不显示
        }
      })
    },
    getUserAmount() {
      this.$request.get('/user/amount', { token: util.storage.get('token') }).then(res => {
        if (res.code !== 0) {
          return
        }
        this.balance = res.data.balance
        this.freeze = res.data.freeze
        this.score = res.data.score
        this.totleConsumed = res.data.totleConsumed
      })
    },
    onShowAbout() {
      this.$dialog.alert({
        // title: '标题',
        message: this.$store.state.globalData.desc
      }).then(() => {
        // on close
      })
    },
    onSettingClick() {
      this.$router.push({ path: '/setting' })
    }
  }
}
</script>
<style lang="less" scoped>
.style-box() {
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.header {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 180px;
  color: #fff;
  padding: 0 15px;
  // background-color: #fe4140;
  background: linear-gradient(
    309deg,
    rgba(255, 112, 61, 1) 0%,
    rgba(255, 70, 57, 1) 100%
  );
  &-media {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
  }
  &-title {
    font-size: 18px;
  }
  &-setting {
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 24px;
  }
}
.main {
  // padding:0 20px;
  margin-top: -50px;
}
.group {
  .style-box();
  margin: 0 15px 15px 15px;
  &-inner{
    padding:10px 0;
  }
}
.balance-group {
  .style-box();
  .van-row {
    text-align: center;
  }
  .van-col {
    text-align: center;
  }
  &-title {
    font-size: 14px;
    font-weight: bold;
    color: #000;
    margin-bottom: 5px;
  }
  &-txt {
    font-size: 12px;
    color: #999;
  }
}
.changy-group {
  .van-icon {
    font-size: 24px;
  }
  .van-col {
    margin-bottom:10px;
  }
}

.user-gruop {
  &-name {
    // padding: 10px 0;
    color: #333;
    font-size: 12px;
    margin-bottom: 10px;
  }
}
.user-section {
  .style-box();
  margin: 0 20px 15px 20px;
  &-title {
    font-size: 14px;
    color: #000;
    font-weight: bold;
  }
  &-hd {
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
  &-bd {
    box-sizing: border-box;
    width: 100%;
    padding: 15px 0;
  }
  &-grid {
    box-sizing: border-box;
    width: 20%;
    float: left;
    text-align: center;
    .van-icon {
      font-size: 24px;
      margin-bottom: 5px;
    }
    &-img {
      display: inline-block;
      width: 30px;
      height: 30px;
      // margin-bottom: 5px;
    }
    &-title {
      color: #333;
      font-size: 12px;
    }
  }
}
</style>
