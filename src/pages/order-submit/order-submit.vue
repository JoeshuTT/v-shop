<template>
  <div class="contaienr">
    <template v-if="isNeedLogistics">  
    <div class="address-box mb10" v-if="defaultAddress.linkMan" @click="onAddressChoose">
      <div class="address-box-hd">
        <div class="address-box-inner">
          <van-icon name="location-o" class="address-box-inner-icon"/>
          <div class="address-box-inner-title">收货人：{{defaultAddress.linkMan}}</div>
          <div class="address-box-inner-title">{{defaultAddress.mobile}}</div>
        </div>  
        <div class="address-box-inner-bottom">收货地址：{{defaultAddress.provinceStr}}{{defaultAddress.cityStr}}{{defaultAddress.areaStr}}{{defaultAddress.address}}</div>
      </div>
      <div class="address-box-bd"><van-icon name="arrow" /></div>
    </div> 
    <van-cell v-else class="address-card mb10" title="新增收货地址" icon="add-square" is-link @click="onAddressChoose"></van-cell>
    </template> 
    <div class="order-info">

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
  :key="index"
  :num="item.selectedNum"
  :desc="item.propTitle"
  :price="formatPrice(item.price)"
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

  <van-field
    class="mb10"
    v-model="remark"
    label="买家留言"
    type="textarea"
    placeholder="点击给商家留言"
    rows="1"
    autosize
  />
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

import { Card,Field ,CouponCell, CouponList,SubmitBar } from 'vant'
import { storage, sessionStorage } from '@/common/util'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    [Card.name]: Card,
    [Field.name]: Field,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [SubmitBar.name]: SubmitBar,
  },
  data() {
    return {
      remark:'',
      chosenCoupon: -1,
      coupons: [],
      disabledCoupons: [],
      showList:false,
      isNeedLogistics:true, // 是否需要物流信息
      hasDiscount:false,
      goodsInfo:[],
    }
  },
  computed:{
    ...mapState(['defaultAddress']),
    goodsPrice(){
      let price = this.goodsInfo.reduce((total,item)=> total+item.selectedNum*item.price,0)
      return (price/100).toFixed(2)
    },
    youhui(){
      let youhui = this.chosenCoupon !== -1 ? this.coupons[this.chosenCoupon].value : 0
      return (youhui/100).toFixed(2)
    },
    totalPrice(){
      let youhui = this.chosenCoupon !== -1 ? this.coupons[this.chosenCoupon].value : 0
      let price = this.goodsInfo.reduce((total,item)=> total+item.selectedNum*item.price,0) - youhui
      return (price/100).toFixed(2)
    },
  },
  created() {
    // 
    this.getMyDiscounts()
    // 立即购买buy,加入购物车cart,
    if(this.$route.query.type === 'buy'){
      this.goodsInfo = sessionStorage.get('buyInfo')
    }else{
      let cartInfo = storage.get('cartInfo'),checkedGoods=this.$route.query.checkedGoods || []
      console.log(cartInfo)
      cartInfo = checkedGoods.length ? cartInfo.filter(item => checkedGoods.indexOf(item.id) !== -1) : cartInfo
      this.goodsInfo = cartInfo
    }
    // this. = 
    // this.$bus.$on('defaultAddress',address=>{
    //   console.log(address)
    //   console.log(this)
  
    //      this.$nextTick(()=>{
    //                 this.address=1
    //             })
    // })
    console.log(this.defaultAddress)
    if(!this.defaultAddress.linkMan){
      this.getDefaultAddress()
    }
    
  },
  methods: {
    ...mapMutations(['updateDefaultAddress']),
    formatPrice(price) {
      return (price / 100).toFixed(2);
    },
    onAddressChoose(){
      this.$router.push({path:'/address-list'})
    },
    onShowCoupons(){
      this.showList = !this.showList;
    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
      if(index>-1){
        this.hasDiscount = true
      }else{
        this.hasDiscount = false
      }
    },
    onExchange(code) {
      console.log(code)
      this.$toast.loading({
        mask: true,
        message: '兑换中...',
        duration:0,
      })
      this.$request.get('/discounts/fetch',{token:storage.get('token'),pwd:code}).then(res=>{
        if(res.code !== 0){
          this.$toast(res.msg)
          return;
        } 
        const coupon = {
          id:res.data.id,
          name:res.data.name,
          condition:`消费满 ${res.data.moneyHreshold} 可用`,
          startAt:this.formatSeconds(res.data.dateStart),
          endAt:this.formatSeconds(res.data.dateEnd),
          value: parseFloat((res.data.money*100).toFixed(2)),
          valueDesc: `${res.data.money}`,
          unitDesc: '元',
          // description:`每人限领 2 张,消费满 ${res.data.moneyHreshold} 元可用`
        }
        this.coupons.unshift(coupon);
        this.$toast({message:'兑换成功',duration:1500})
         

      })
    },
    onSubmit(){
      if(!this.defaultAddress.linkMan){
        this.$toast({message:'地址栏不能为空',duration:1500})
        return;
      }
      // 提交订单
      this.$toast.loading({
        mask: true,
        message: '提交订单中...',
        duration:0,
      })
      const goods = this.goodsInfo.map(item=>({goodsId:item.goodsId,number:item.selectedNum,propertyChildIds:item.propertyChildIds,logisticsType:0}))
      // 拼团,砍价模块未加入
      const params = {
        token:storage.get('token'),
        goodsJsonStr:JSON.stringify(goods),
        calculate:false,  // true 不实际下单，而是返回价格计算
        expireMinutes:0,  // 多少分钟未支付自动关闭本订单，传0不自动关闭订单
        peisongType:'kd',  // 配送类型，kd 代表快递；zq代表到店自取
        couponId:this.chosenCoupon !== -1 ? this.coupons[this.chosenCoupon].id : '',  // 优惠券编号
        remark:this.remark,
        address:this.defaultAddress.address,
        provinceId:this.defaultAddress.provinceId,
        cityId:this.defaultAddress.cityId,
        code:this.defaultAddress.code,
        linkMan:this.defaultAddress.linkMan,
        mobile:this.defaultAddress.mobile,

      }
      this.$request.post('/order/create',params).then(res=>{
        if(res.code !== 0){
          this.$toast(res.msg)
          return;
        }
        this.$toast.clear()
        // 移除已勾选的商品信息
        if(this.$route.query.type === 'buy'){
          sessionStorage.remove('buyInfo')
        }else{
          let cartInfo = storage.get('cartInfo'),checkedGoods=this.$route.query.checkedGoods || []
          cartInfo = checkedGoods.length ? cartInfo.filter(item => checkedGoods.indexOf(item.id) === -1) : cartInfo
          storage.set('cartInfo')
        }
        // 
        this.$router.replace({path:'/order-list?status=0'})

      })
    },
    getDefaultAddress(){
      this.$request.get('/user/shipping-address/default/',{token:storage.get('token')}).then(res=>{
        this.updateDefaultAddress(res.data||{})
      })
    },
    formatSeconds(value){
      let time = new Date(value.replace(/-/g, '/')).getTime()/1000
      return time
    },
    getMyDiscounts(){
      this.$request.get('/discounts/my',{token:storage.get('token'),status:'0'}).then(res=>{
        this.coupons = res.data.map(item=>({
          id:item.id,
          name:item.name,
          condition:`消费满 ${item.moneyHreshold} 可用`,
          startAt:this.formatSeconds(item.dateStart),
          endAt:this.formatSeconds(item.dateEnd),
          value: parseFloat((item.money*100).toFixed(2)),
          valueDesc: `${item.money}`,
          unitDesc: '元',
          // description:`每人限领 2 张,消费满 ${item.moneyHreshold} 元可用`
        }))
      })
      this.$request.get('/discounts/my',{token:storage.get('token'),status:'1,2,3'}).then(res=>{
        // this.updateDefaultAddress(res.data)
        this.disabledCoupons = res.data.map(item=>({
          id:item.id,
          name:item.name,
          condition:`消费满 ${item.moneyHreshold} 可用`,
          startAt:this.formatSeconds(item.dateStart),
          endAt:this.formatSeconds(item.dateEnd),
          value: parseFloat((item.money*100).toFixed(2)),
          valueDesc: `${item.money}`,
          unitDesc: '元',
          reason:item.statusStr
        }))
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .color-red{
    color:#f44!important;
  }
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


