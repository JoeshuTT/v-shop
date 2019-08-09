<template>
  <div class="container pd100">
    <template v-if="isNeedLogistics">
      <div class="address-box mb10" v-if="defaultAddress.linkMan" @click="onAddressChoose">
        <div class="address-box-hd">
          <div class="address-box-inner">
            <van-icon name="location-o" class="address-box-inner-icon"/>
            <div class="address-box-inner-title">收货人：{{defaultAddress.linkMan}}</div>
            <div class="address-box-inner-title">{{defaultAddress.mobile}}</div>
          </div>
          <div class="address-box-inner-bottom">收货地址：{{defaultAddress.address}}</div>
        </div>
        <div class="address-box-bd"><van-icon name="arrow" /></div>
      </div>
      <van-cell v-else class="address-card mb10" title="新增收货地址" icon="add-square" is-link @click="onAddressChoose"></van-cell>
    </template>
    <div class="order-info">
      <van-cell-group>
        <van-cell title="商品列表"></van-cell>

      <!-- <van-card
  :num="buyInfo.selectedNum"
  :price="price"
  :desc="buyInfo.basicInfo.characteristic"
  :title="buyInfo.basicInfo.name"
  :thumb="buyInfo.basicInfo.pic"
/> -->
<van-card
  v-for="(item,index) in goodsInfo"
  :tag="marketing.typeStr"
  :key="index"
  :num="item.selectedNum"
  :desc="item.propTitle"
  :price="item.price.toFixed(2)"
  :title="item.name"
  :thumb="item.pic"
>
</van-card>

<van-coupon-cell
  v-if="coupons.length"
  :coupons="coupons"
  :chosen-coupon="chosenCoupon"
  @click="onShowCoupons"
/>

  <van-cell v-if="isNeedLogistics" title="配送方式" value="快递"></van-cell>
</van-cell-group>
<van-cell-group>
  <van-field
    class="mb10"
    v-model="remark"
    label="买家留言"
    type="textarea"
    placeholder="点击给商家留言"
    rows="1"
    autosize
  />
</van-cell-group>
<van-cell-group class="mb20">
   <van-cell title="支付工具"></van-cell>
   <van-cell title="余额" :label="'账户余额：￥'+balance+'元'" size="large">
       <template slot="default">
<van-switch
  v-model="isBalancePay"
  active-color="#f44"
  inactive-color="#d7d7d7"
/>
  </template>
   </van-cell>

</van-cell-group>
  <van-cell title="商品金额" :value="'¥'+goodsPrice"></van-cell>
  <van-cell v-if="isNeedLogistics" title="运费" value="+0.00"></van-cell>
  <van-cell v-if="hasDiscount" title="优惠" :value="'-'+youhui"></van-cell>
    </div>
    <van-submit-bar
      button-text="提交订单"
      @submit="onSubmit"
    >
    <div slot="default" class="submit-bar-left">
      <span>合计：</span>
      <span class="submit-bar-price">¥ {{totalPrice}}</span>
   </div>
  </van-submit-bar>

    <!-- 优惠券弹层 -->
  <van-popup v-model="showList" position="bottom">
    <van-coupon-list
      :coupons="coupons"
      :chosen-coupon="chosenCoupon"
      :disabled-coupons="disabledCoupons"
      @change="onChange"
      @exchange="onExchange"
    />
  </van-popup>
  </div>
</template>

<script>

import { Card, Field, CouponCell, CouponList, SubmitBar, Switch } from 'vant'
import { storage, sessionStorage } from '@/common/util'
import { mapState, mapMutations } from 'vuex'
import { pay_balance } from '@/common/pay'

export default {
  components: {
    [Card.name]: Card,
    [Field.name]: Field,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [SubmitBar.name]: SubmitBar,
    [Switch.name]: Switch
  },
  data() {
    return {
      remark: '',
      chosenCoupon: -1,
      coupons: [],
      disabledCoupons: [],
      showList: false,
      isNeedLogistics: true, // 是否需要物流信息
      hasDiscount: false,
      goodsInfo: [],
      isBalancePay: true, //  钱包支付
      balance: 0,
      expireMinutes: 60,
      marketing: {}
    }
  },
  computed: {
    ...mapState(['defaultAddress']),
    goodsPrice() {
      const price = this.goodsInfo.reduce((total, item) => total + item.selectedNum * item.price, 0)
      return parseFloat(price).toFixed(2)
    },
    youhui() {
      const youhui = this.chosenCoupon !== -1 ? parseFloat((this.coupons[this.chosenCoupon].value / 100).toFixed(2)) : 0
      return parseFloat(youhui).toFixed(2)
    },
    totalPrice() {
      const youhui = this.chosenCoupon !== -1 ? parseFloat((this.coupons[this.chosenCoupon].value / 100).toFixed(2)) : 0
      const price = this.goodsInfo.reduce((total, item) => total + item.selectedNum * item.price, 0) - youhui
      return price > 0 ? parseFloat(price).toFixed(2) : '0.00'
    }
  },
  created() {
    // 立即购买buy,加入购物车cart,
    if (this.$route.query.type === 'buy') {
      this.goodsInfo = sessionStorage.get('buyInfo') || []
      this.marketing = this.goodsInfo[0].marketing
    } else {
      let cartInfo = storage.get('cartInfo'); const checkedGoods = this.$route.query.checkedGoods || []
      cartInfo = checkedGoods.length ? cartInfo.filter(item => checkedGoods.indexOf(item.id) !== -1) : cartInfo
      this.goodsInfo = cartInfo
    }
    // 默认地址
    if (!this.defaultAddress.linkMan) {
      this.getDefaultAddress()
    }
    // 账户余额
    this.getUserAmount()

    if (this.marketing.type) {
      this.expireMinutes = 0
    }
    if (!this.marketing.type) {
      this.getMyDiscounts()
    }
  },
  methods: {
    ...mapMutations(['updateDefaultAddress']),
    onAddressChoose() {
      this.$router.push({ path: '/address-list', query: { isChoose: true }})
    },
    onShowCoupons() {
      this.showList = !this.showList
    },
    onChange(index) {
      this.showList = false
      this.chosenCoupon = index
      if (index > -1) {
        this.hasDiscount = true
      } else {
        this.hasDiscount = false
      }
    },
    onExchange(code) {
      this.$toast.loading({
        mask: true,
        message: '兑换中...',
        duration: 0
      })
      this.$request.get('/discounts/fetch', { token: storage.get('token'), pwd: code }).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        const coupon = {
          id: res.data.id,
          name: res.data.name,
          condition: `消费满 ${res.data.moneyHreshold} 可用`,
          startAt: this.formatSeconds(res.data.dateStart),
          endAt: this.formatSeconds(res.data.dateEnd),
          value: parseFloat((res.data.money * 100).toFixed(2)),
          valueDesc: `${res.data.money}`,
          unitDesc: '元'
          // description:`每人限领 2 张,消费满 ${res.data.moneyHreshold} 元可用`
        }
        this.coupons.unshift(coupon)
        this.$toast({ message: '兑换成功', duration: 1500 })
      })
    },
    onSubmit() {
      if (!this.defaultAddress.linkMan) {
        this.$toast({ message: '地址栏不能为空', duration: 1500 })
        return
      }
      // 提交订单
      this.$toast.loading({
        mask: true,
        message: '订单创建中',
        duration: 0
      })
      const goods = this.goodsInfo.map(item => ({ goodsId: item.goodsId, number: item.selectedNum, propertyChildIds: item.propertyChildIds, logisticsType: 0 }))
      const params = {
        token: storage.get('token'),
        goodsJsonStr: JSON.stringify(goods),
        calculate: false, // true 不实际下单，而是返回价格计算
        expireMinutes: this.expireMinutes, // 多少分钟未支付自动关闭本订单，传0不自动关闭订单
        peisongType: 'kd', // 配送类型，kd 代表快递；zq代表到店自取
        couponId: this.chosenCoupon !== -1 ? this.coupons[this.chosenCoupon].id : '', // 优惠券编号
        remark: this.remark,
        address: this.defaultAddress.address,
        provinceId: this.defaultAddress.provinceId,
        cityId: this.defaultAddress.cityId,
        code: this.defaultAddress.code,
        linkMan: this.defaultAddress.linkMan,
        mobile: this.defaultAddress.mobile,
        kjid: this.marketing.kjid || '', // 砍价编号，可直接购买砍价商品
        pingtuanOpenId: this.marketing.pingtuanOpenId, // 拼团购买的团号,不是拼团id
        extJsonStr: JSON.stringify({
          discount: this.chosenCoupon !== -1 ? parseFloat((this.coupons[this.chosenCoupon].value / 100).toFixed(2)) : 0, // 优惠券抵扣金额
          marketing: this.marketing // 商品营销活动相关数据
        })

      }

      // 发起拼团
      if (this.marketing.type === 'pintuan' && !this.marketing.pingtuanOpenId) {
        this.$request.post('/shop/goods/pingtuan/open', { goodsId: this.goodsInfo[0].goodsId, token: storage.get('token') }).then(res => {
          if (res.code !== 0) {
            this.$toast(res.msg)
            return
          }
          // 开团成功并创建订单
          params.pingtuanOpenId = res.data.id
          this.marketing.pingtuanOpenId = res.data.id
          this.createOrder(params)
        })
        return
      }
      // 创建订单
      this.createOrder(params)
    },
    createOrder(params) {
      this.$request.post('/order/create', params).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.$toast.clear()
        const orderResult = res.data
        // 钱包支付订单
        this.onPay(orderResult)
      })
    },
    pintuanOrderAction() {

    },
    onPay(orderResult) {
      // 支付方式(系统钱包支付,公众号支付未接入)
      const orderId = orderResult.id
      const amountReal = orderResult.amountReal
      const goodsId = this.goodsInfo[0].goodsId // 拼团详情页需要用到
      if (this.isBalancePay) {
        this.$toast.loading({
          mask: true,
          message: '支付提交中',
          duration: 0
        })
        pay_balance(orderId, storage.get('token')).then(res => {
          if (res.code !== 0) {
            this.$toast(res.msg)
            return
          }
          this.$toast.clear()
          this.removeStorageGoods()

          this.$dialog.confirm({
            title: '支付成功',
            message: `实付￥${amountReal}`,
            cancelButtonText: '返回首页',
            confirmButtonText: '查看详情'
          }).then(() => {
            if (this.marketing.type === 'pintuan') {
              this.$router.replace({ path: '/pintuan/pintuan', query: { tuanId: this.marketing.pingtuanOpenId, goodsId }})
              return
            }
            this.$router.replace({ path: '/order-detail', query: { id: orderId }})
            // on confirm
          }).catch(() => {
            // on cancel
            this.$router.replace({ path: '/home' })
          })
        })
      } else {
        this.removeStorageGoods()
        this.$router.replace({ path: '/order-list?status=0' })
      }
    },
    removeStorageGoods() {
      // 支付成功后移除已勾选的商品信息
      if (this.$route.query.type === 'buy') {
        sessionStorage.remove('buyInfo')
      } else {
        let cartInfo = storage.get('cartInfo')
        const checkedGoods = this.$route.query.checkedGoods || []
        cartInfo = checkedGoods.length ? cartInfo.filter(item => !(checkedGoods.indexOf(item.id) !== -1)) : cartInfo
        storage.set('cartInfo', cartInfo)
      }
    },
    getDefaultAddress() {
      this.$request.get('/user/shipping-address/default', { token: storage.get('token') }).then(res => {
        this.updateDefaultAddress(res.data || {})
      })
    },
    formatSeconds(value) {
      const time = new Date(value.replace(/-/g, '/')).getTime() / 1000
      return time
    },
    getMyDiscounts() {
      this.$request.get('/discounts/my', { token: storage.get('token'), status: '0' }).then(res => {
        if (res.code !== 0) {
          return
        }
        this.coupons = res.data.map(item => ({
          id: item.id,
          name: item.name,
          condition: `消费满 ${item.moneyHreshold} 可用`,
          startAt: this.formatSeconds(item.dateStart),
          endAt: this.formatSeconds(item.dateEnd),
          value: parseFloat((item.money * 100).toFixed(2)),
          valueDesc: `${item.money}`,
          unitDesc: '元'
          // description:`每人限领 2 张,消费满 ${item.moneyHreshold} 元可用`
        }))
      })
      this.$request.get('/discounts/my', { token: storage.get('token'), status: '1,2,3' }).then(res => {
        if (res.code !== 0) {
          return
        }
        // this.updateDefaultAddress(res.data)
        this.disabledCoupons = res.data.map(item => ({
          id: item.id,
          name: item.name,
          condition: `消费满 ${item.moneyHreshold} 可用`,
          startAt: this.formatSeconds(item.dateStart),
          endAt: this.formatSeconds(item.dateEnd),
          value: parseFloat((item.money * 100).toFixed(2)),
          valueDesc: `${item.money}`,
          unitDesc: '元',
          reason: item.statusStr
        }))
      })
    },
    getUserAmount() {
      this.$request.get('/user/amount', { token: storage.get('token') }).then(res => {
        if (res.code !== 0) {
          return
        }
        this.balance = res.data.balance
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .address-box{
    position: relative;
    box-sizing: border-box;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding:8px 15px;
    background: #fff;
    &-hd{
      flex: 1;
      // padding:0 10px;
      padding-left: 20px;
    }
    &-bd{
      padding-left: 5px;

    }
    &-inner{
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-icon{
        position: absolute;
        top:2px;
        left: -20px;
      }
      &-title{
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-bottom: 5px;
      }
      &-bottom{
        font-size: 12px;
        color: #666;
      }
    }
    &:before{
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background-size: 80px;
      content: '';
    }
  }
  .address-card{
    position: relative;
    padding: 10px 15px;
    align-items: center;
    &:before{
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background-size: 80px;
      content: '';
    }
  }
  .address-card .van-cell__left-icon{
    color: #1989fa;
    font-size: 40px;
  }
  .address-card .van-cell__title{
    line-height: 40px;
  }
  .order-info{
    box-sizing: border-box;
    width:100%;
    // padding:0 15px;
    // background: #fff;
  }
  .submit-bar-left{
    flex: 1;
    padding-right: 12px;
    color: #323233;
    font-weight: 500;
    text-align: right;
  }
  .submit-bar-left span{
    display: inline-block;
  }
  .submit-bar-price{
    color: #f44;
    font-size: 18px;
  }

</style>

