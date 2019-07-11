  <template>
  <div class="contaienr pd50">
    <van-swipe :autoplay="3000"
      indicator-color="white"
      class="goods-swiper">
      <van-swipe-item v-for="item in banner"
        :key="item.id">
        <img :src="item.pic"
          alt="" />
      </van-swipe-item>
    </van-swipe>
    <div class="goods-desc mb10">
      <div class="goods-desc-hd">
        <span class="goods-desc-name">{{basicInfo.name}}</span>
        <div class="btn-fav" v-if="hasFav" @click="onFavDelete($route.query.id)">已收藏</div>
        <div class="btn-fav btn-fav-danger"  v-else @click="onFavAdd($route.query.id)">收藏</div>
      </div>
      <div class="goods-desc-brief"
        v-if="basicInfo.characteristic">{{basicInfo.characteristic}}</div>
      <div class="goods-desc-price">￥{{basicInfo.minPrice}}
        <!-- <span class="goods-desc-price-span">￥{{basicInfo.originalPrice}}</span> -->
      </div>
      <div class="goods-desc-more">
        <div class="goods-desc-more-item">浏览：{{basicInfo.views}}</div>
        <div class="goods-desc-more-item ui-center">购买：{{basicInfo.numberOrders}}</div>
        <div class="goods-desc-more-item ui-right">好评：{{basicInfo.numberGoodReputation}}</div>
      </div>
    </div>
    <div class="goods-section">
      <van-cell class="mb10"
        title="领券"
        is-link
        @click="onShowCoupon"
        v-if="coupons.length" />
      <van-cell class="mb10"
        :title="skuTitle"
        is-link
        @click="onShowSku"
        v-if="properties.length" />
      <van-cell class="mb10"
        title="服务 担保交易"
        is-link
        @click="onShowService" />
    </div>
    <template v-if="rateList.length">
      <div class="goods-reputation mb10">
        <van-cell :to="'/goods-reputation?id='+basicInfo.id"
          class="mb10"
          :title="'评价('+rateList.length+')'"
          value="全部评价"
          is-link />
        <div class="goods-reputation-inner">
          <div class="goods-reputation-inner-hd">
            <div class="goods-reputation-inner-media"><img :src="reputation.avatarUrl"
                alt=""></div>
            <div class="goods-reputation-inner-name">{{reputation.nickName}}</div>
            <div class="goods-reputation-inner-stars">
              <van-rate v-model="reputation.rate"
                :size="14"
                color="#f44"
                void-icon="star"
                void-color="#eee"
                readonly />
            </div>
          </div>
          <!-- <div class="goods-reputation-inner-bd"> -->
            <!-- <span class="goods-reputation-inner-tag">质量不错</span> -->
            <!-- <span class="goods-reputation-inner-tag">下次再来</span> -->
          <!-- </div> -->
          <div class="goods-reputation-inner-ft">
            <p>{{reputation.remark}}</p>
            <p>{{reputation.property}}</p>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <van-cell class="mb10"
        title="暂无评价" />
    </template>
    <div class="goods-h2 common-h2">
      <span class="common-h2-title">商品详情</span>
    </div>
    <div class="goods-content"
      v-html="content"></div>

    <!-- 领券弹层 -->
    <van-popup v-model="showService"
      position="bottom">
      <div class="popup">
        <div class="service-desc">
          <img src="../../assets/gif_1.gif" style="margin:20px auto;" />
        </div>
        <van-button class="popup-confirm"
          type="danger"
          size="large"
          @click="onShowService">我知道了</van-button>
      </div>
    </van-popup>
    <!-- 服务弹层 -->
    <van-popup v-model="showCoupon"
      position="bottom">
      <div class="popup popup-coupon">
        <div class="coupon-list-header van-hairline--bottom">可用优惠券</div>
        <div class="coupon-list">
          <div class="coupon-list-item"
            v-for="(coupon, i) in coupons"
            :key="coupon.id">
            <div class="coupon-list-item-hd">
              <div class="coupon-list-item-money">
                <span class="fz12">￥</span>{{coupon.moneyMin}}</div>
              <div class="coupon-list-item-moneyHreshold">满{{coupon.moneyHreshold}}元可用</div>
            </div>
            <div class="coupon-list-item-bd">
              <div class="coupon-list-item-name">{{coupon.moneyMin}}元券</div>
              <div class="coupon-list-item-dateEndDays">领取后{{coupon.dateEndDays}}天有效</div>
            </div> 
            <div v-if="coupon.status === 0" class="coupon-list-item-btn" @click="handleCouponClicked(coupon,i)">立即领取</div> 
            <div v-else class="coupon-list-item-btn coupon-list-item-btn-clicked">领取成功</div>
          </div>
        </div>
        <van-icon name="close"
          class="popup-close"
          @click="onShowCoupon" />
        <van-button class="popup-confirm"
          type="danger"
          size="large"
          @click="onShowCoupon">完成</van-button>
      </div>
    </van-popup>
    <!-- 商品规格弹层 -->
    <div class="sku-container">
      <van-sku hide-quota-text
        v-model="showSku"
        :sku="skuData.sku"
        :goods="skuData.goods_info"
        :goods-id="skuData.goods_id"
        :hide-stock="skuData.sku.hide_stock"
        :quota="skuData.quota"
        :quota-used="skuData.quota_used"
        :custom-stepper-config="customStepperConfig"
        :message-config="messageConfig"
        :custom-sku-validator="customSkuValidator"
        @buy-clicked="onBuyClicked"
        @add-cart="onAddCartClicked"
        @sku-selected="onSkuSelected" />
    </div>

    <!-- 商品导航 -->
    <van-goods-action>
      <van-goods-action-icon icon="thumb-circle-o"
        text="首页"
        to="/home"
        replace />
      <van-goods-action-icon icon="chat-o"
        text="客服"
        @click="onClickIcon" />
      <van-goods-action-icon icon="cart-o"
        text="购物车"
        to="/cart"
        :info="cartCount"
        replace />
      <van-goods-action-button type="warning"
        text="加入购物车"
        @click="onClickButton" />
      <van-goods-action-button type="danger"
        text="立即购买"
        @click="onClickButton" />
    </van-goods-action>
    <!-- 右侧悬浮图标 -->
    <div class="side-bar">
      <div class="side-bar-share mb10" @click="goShare"><van-icon :size="22" color="#7d7e80" name="share" /></div>
      <div class="side-bar-backtop anim-scale" @click="goBackTop" v-show="backTop"><van-icon :size="22" color="#7d7e80" name="arrow-up" /></div>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Sku, GoodsAction, GoodsActionIcon, GoodsActionButton, Rate, Tag } from 'vant'

import { storage, sessionStorage } from '@/common/util'
import { scrollTo } from '@/common/scroll-to'

const LIMIT_TYPE = {
  QUOTA_LIMIT: 0,
  STOCK_LIMIT: 1
}
export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Sku.name]: Sku,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    [Rate.name]: Rate,
    [Tag.name]: Tag,
  },
  data() {
    return {
      cartCount:'',
      backTop:false,
      banner: [],
      rateList: [],
      reputation: {},
      basicInfo: {},
      content: '',
      properties: [],
      showCoupon: false,
      hasFav:false,
      coupons: [],
      showService: false,
      showSku: false,
      skuTitle: '选择',
      skuData: {
        goods_id: '',
        sku: {
          tree: [],
          list: [],
          price: '', // 默认价格（单位元）
          stock_num: 99, // 商品总库存
          collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
          none_sku: false, // 是否无规格商品
          hide_stock: false, // 是否隐藏剩余库存
        },
        goods_info: {}
      },
      customSkuValidator: () => '请先选择商品规格',
      customStepperConfig: {
        quotaText: '单次限购100件',
        stockFormatter: (stock) => `剩余${stock}件`,
        handleOverLimit: (data) => {
          console.log(data)
          const { action, limitType, quota } = data;
          if (action === 'minus') {
            this.$toast('至少选择一件商品');
          } else if (action === 'plus') {
            if (limitType === LIMIT_TYPE.QUOTA_LIMIT) {
              this.$toast(`限购${quota}件`);
            } else {
              this.$toast('库存不够了');
            }
          }
        }
      },
      messageConfig: {},
    }
  },
  watch: {
    //   $route
  },
  created() {
    console.log(this.$route.query);
    this.getGoodsDetail(this.$route.query.id)
    this.getDiscountsCoupons()
    this.getGoodsReputation(this.$route.query.id)
    console.dir(this.$router.currentRoute.fullPath)
    this.checkGoodsFav(this.$route.query.id) 
    // console.log(this.formatPoints(500))
    this.getCartCount()
    
  },
  mounted() {
    window.addEventListener('scroll', this.onPageScroll, false)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onPageScroll, false);
  },
  methods: {
    getCartCount(){
      const cartInfo = storage.get('cartInfo') || []
      this.cartCount = cartInfo.length || ''
    },
    onPageScroll(){ 
      const sTop = document.documentElement.scrollTop || document.body.scrollTop
      this.backTop = sTop >= 500
    },
    goShare(){ 
      this.$toast('未开放')
    },
    goBackTop(){ 
      scrollTo(0,800)
    },
    formatPoints(money) {
      return parseFloat((money * 100).toFixed(2))
    },
    onClickIcon() {
      // this.$toast('点击图标');
    },
    onClickButton() {
      // this.$toast('点击按钮');
      // this.$router.push({path:'/order-submit'})
      this.showSku = !this.showSku
    },
    onShowService() {
      this.showService = !this.showService
    },
    onShowCoupon() {
      this.showCoupon = !this.showCoupon
    },
    checkGoodsFav(id){
      this.$request.get('/shop/goods/fav/check', { goodsId:id, token: storage.get('token') }).then(res => {
        if(res.code === 0){
          this.hasFav = true
        }else{
          this.hasFav = false
        }
      })
    },
    onFavAdd(id){
      this.$request.post('/shop/goods/fav/add', { goodsId:id, token: storage.get('token') }).then(res => {
        if(res.code === 0){
          this.$toast({message:'收藏成功',duration:1500})
          this.hasFav = true
        }else{
          this.hasFav = false
        }
      })
    },
    onFavDelete(id){
      this.$request.post('/shop/goods/fav/delete', { goodsId:id, token: storage.get('token') }).then(res => {
        if(res.code === 0){
          this.$toast({message:'取消收藏成功',duration:1500})
          this.hasFav = false
        }else{
          this.hasFav = true
        }
      })
    },
    handleCouponClicked(coupon,index) {
      if(coupon.pwd){
        this.$toast({ message: '本券需要使用口令才能领取', duration: 1500 })
        return;
      }
      this.$request.post('/discounts/fetch', { id:coupon.id, token: storage.get('token') }).then(res => {
        if (res.code === 0) {
          // this.$toast('领取成功') 
          this.$toast({ message: '恭喜,抢到了~', duration: 1500 })
          this.coupons[index].status = 0
        } else if (res.code === 20001 || res.code === 20002 || res.code === 20003) {
          // this.$toast(res.msg)
          this.$toast({ message: '很遗憾,没抢到~', duration: 1500 })
          this.coupons[index].status = 1
        } else {
          this.$toast(res.msg)
        }
      })
    },
    rate2star(rateValue) {
      let value = 5
      switch (rateValue) {
        case 0:
          value = 1
          break;
        case 1:
          value = 3
          break;
        case 2:
          value = 5
          break;
        default:
          value = 5
      }
      return value
    },
    getGoodsReputation(goodsId, page = 1, pageSize = 50) {
      this.$request.post('/shop/goods/reputation', { goodsId, page, pageSize }).then(res => {
        if (res.code !== 0) {
          // this.$toast(res.msg)
          return;
        }
        this.rateList = res.data
        // user.avatarUrl
        this.reputation = {
          id:res.data[0].goods.id,
          avatarUrl: res.data[0].user.avatarUrl || `${require('@/assets/avatar_default.png')}`,
          nickName: res.data[0].user.nickName || res.data[0].user.mobile.replace(res.data[0].user.mobile.substring(3, 7), '****'),
          rate: this.rate2star(res.data[0].goods.goodReputationStr),
          remark: res.data[0].goods.goodReputationRemark || '此用户没有填写评价',
          date: res.data[0].goods.dateReputation.slice(0,10),
          property:res.data[0].goods.property
        }
      })
    },
    onShowSku() {
      this.showSku = !this.showSku
    },
    onBuyClicked(data) {
      console.log(data)
      // 立即购买商品数据定义格式
      let goodsInfo = []
      if (this.properties.length) {
        goodsInfo.push({
          id: `${new Date().getTime()}`,
          goodsId: data.goodsId,
          propertyChildIds: data.selectedSkuComb.propertyChildIds,
          propTitle: this.skuTitle.replace('已选 ', ''),
          price: data.selectedSkuComb.price,
          selectedNum: data.selectedNum,
          messages: data.messages,
          name: this.basicInfo.name,
          characteristic: this.basicInfo.characteristic,
          pic: this.basicInfo.pic,
        })
      } else {
        goodsInfo.push({
          id: `${new Date().getTime()}`,
          goodsId: data.goodsId,
          propertyChildIds: '',
          propTitle: this.skuTitle.replace('已选 ', ''),
          price: parseFloat((this.basicInfo.minPrice * 100).toFixed(2)),
          selectedNum: data.selectedNum,
          messages: data.messages,
          name: this.basicInfo.name,
          characteristic: this.basicInfo.characteristic,
          pic: this.basicInfo.pic,
        })
      }

      sessionStorage.set('buyInfo', goodsInfo)
      this.$router.push({ path: '/order-submit', query: { type: 'buy' } })
    },
    onAddCartClicked(data) {
      console.log(data)
      // 加入购物车商品数据定义格式
      let goodsInfo = storage.get('cartInfo') || []
      // 
      if (this.properties.length) {
        // 添加相同且规格一致的商品
        let index = goodsInfo.findIndex(item => item.goodsId === data.goodsId && item.propertyChildIds === data.selectedSkuComb.propertyChildIds)
        if (goodsInfo.length && index > -1) {
          goodsInfo[index].selectedNum = goodsInfo[index].selectedNum + data.selectedNum
        } else {
          goodsInfo.push({
            id: `${new Date().getTime()}`,
            goodsId: data.goodsId,
            propertyChildIds: data.selectedSkuComb.propertyChildIds,
            propTitle: this.skuTitle.replace('已选 ', ''),
            price: data.selectedSkuComb.price,
            selectedNum: data.selectedNum,
            messages: data.messages,
            name: this.basicInfo.name,
            characteristic: this.basicInfo.characteristic,
            pic: this.basicInfo.pic,
          })
        }

      } else {
        // 添加相同且规格一致的商品
        let index = goodsInfo.findIndex(item => item.goodsId === data.goodsId)
        if (goodsInfo.length && index > -1) {
          goodsInfo[index].selectedNum = goodsInfo[index].selectedNum + data.selectedNum
        } else {
          goodsInfo.push({
            id: `${new Date().getTime()}`,
            goodsId: data.goodsId,
            propertyChildIds: '',
            propTitle: this.skuTitle.replace('已选 ', ''),
            price: parseFloat((this.basicInfo.minPrice * 100).toFixed(2)),
            selectedNum: data.selectedNum,
            messages: data.messages,
            name: this.basicInfo.name,
            characteristic: this.basicInfo.characteristic,
            pic: this.basicInfo.pic,
          })
        }
      }
      this.$toast({ message: '已成功添加到购物车', duration: 1500 })
      storage.set('cartInfo', goodsInfo)
      this.showSku = !this.showSku
    },
    onSkuSelected(data) {
      console.log(data)
      if (data.selectedSkuComb) {
        let title = []
        this.properties.forEach((item, index) => {
          let current = item.childsCurGoods.find(v => v.id === data.selectedSku[`s${index + 1}`])
          title.push(current.name)
        })
        this.skuTitle = `已选 ${title.join(',')}`
        this.getGoodsPrice(this.basicInfo.id, data.selectedSkuComb.propertyChildIds, (res) => {
          data.selectedSkuComb.price = this.formatPoints(res.data.price)
          data.selectedSkuComb.stock_num = res.data.stores
          data.selectedSkuComb.propertyChildIds = res.data.propertyChildIds
        })
      }

    },
    getDiscountsCoupons() {
      this.$request.get('/discounts/coupons', { token: storage.get('token') }).then(res => {
        const data = res.data || []
        this.coupons = data.filter(item => !item.pwd)
      })
    },
    getGoodsPrice(goodsId, propertyChildIds, callback) {
      // this.$toast.loading({
      //   mask: true,
      //   message: '加载中...',
      //   duration:0
      // })
      this.$request.post('/shop/goods/price', { goodsId, propertyChildIds }).then(res => {
        callback(res)
        // this.$toast.clear()
      })
    },
    getGoodsDetail(id) {
      this.$request.get('/shop/goods/detail', { id }).then(res => {
        // this.goodsDetail = res.data
        this.banner = res.data.pics
        this.basicInfo = res.data.basicInfo
        this.content = res.data.content
        let properties = res.data.properties || []  // 商品规格配置数据
        this.properties = properties
        // 无规格
        // if(!properties.length){
        //   this.skuTitle = ''
        //   return;
        // }
        if(this.basicInfo === 1){
          this.$toast(this.basicInfo.statusStr)
        }
        console.log(properties)
        this.skuTitle = `选择 ${properties.reduce((total, item) => total + ' ' + item.name, '')}`
        // 商品规格sku数据
        properties = properties.map((item, index) => ({
          k: item.name,
          k_id: item.id,
          v: item.childsCurGoods,
          k_s: 's' + (index + 1),
          count: item.childsCurGoods.length
        }))
        // console.log(JSON.stringify(properties))
        this.skuData.goods_info = {
          title: this.basicInfo.name,
          picture: this.basicInfo.pic
        }
        this.skuData.goods_id = this.basicInfo.id  // 商品id
        this.skuData.sku.price = this.basicInfo.minPrice.toFixed(2)  // 默认价格
        this.skuData.sku.stock_num = this.basicInfo.stores           // 默认库存
        this.skuData.sku.tree = properties
        // this.skuData.sku.list = [{id: 2258,s1: '49809',s2: '49820'},{id: 2258,s1: '49809',s2: '51416'}]
        // let list = Array.prototype.concat.apply([], properties.map(item => item.v))
        if (properties.length === 0) {
          this.skuTitle = ''
          this.skuData.none_sku = false
          // this.skuData.collection_id= 2261
          return;
        }
        // if (properties.length === 1) {
        //   let newArr = []
        //   let arr0 = properties[0].v

        //   for (let i = 0; i < arr0.length; i++) {
        //     newArr.push({ id: `${arr0[i].id}`, price: this.formatPoints(this.basicInfo.minPrice), s1: arr0[i].id, propertyChildIds: `${arr0[i].propertyId}:${arr0[i].id}`, stock_num: this.skuData.sku.stock_num, })
        //   }
        //   // console.log(newArr)
        //   this.skuData.sku.list = newArr
        //   return;
        // }
        if (properties.length >0) {
          // let newArr = []
          // let arr0 = properties[0].v
          // let arr1 = properties[1].v

          // for (let i = 0; i < arr0.length; i++) {
          //   for (let j = 0; j < arr1.length; j++) {
          //     newArr.push({ id: `${arr0[i].id}${arr1[j].id}`, price: this.formatPoints(this.basicInfo.minPrice), s1: arr0[i].id, s2: arr1[j].id, propertyChildIds: `${arr0[i].propertyId}:${arr0[i].id},${arr1[j].propertyId}:${arr1[j].id}`, stock_num: this.skuData.sku.stock_num, })
          //   }
          // }
          // console.log(newArr)
          // this.skuData.sku.list = newArr
          /**
           * 生成笛卡尔积
           * @returns {*}
           */
          const descartes = function (array){
            if( array.length < 2 ) return array[0] || [];

            return [].reduce.call(array, function(col, set) {
              var res = [];
              col.forEach(function(c) {
                set.forEach(function(s) {
                    var t = [].concat( Array.isArray(c) ? c : [c] );
                    t.push(s);
                    res.push(t);
              })});
              return res;
            });
          } 
          const calc = descartes(Array.prototype.concat.apply([], properties.map(item => [item.v])))
          this.skuData.sku.list = calc.map(item =>{
            let obj = {
              price: this.formatPoints(this.basicInfo.minPrice),
              stock_num: this.skuData.sku.stock_num,
            }
            if(Array.isArray(item)){
              item.forEach((v, i) =>{
                obj[`s${i + 1}`] = v.id
                obj.propertyChildIds = `${obj.propertyChildIds||''}${v.propertyId}:${v.id},`
                obj.id = `${obj.id||''}${v.propertyId}${v.id}`
              })
              return obj

            }else{
                // 一种规格的情况下 
                obj['s1'] = item.id
                obj.propertyChildIds = `${item.propertyId}:${item.id},`
                obj.id = `${item.propertyId}${item.id}`
              return obj
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.text-left {
  text-align: left;
}
.goods-swiper {
  width: 100%;
  height: 410px;
}
.goods-desc {
  box-sizing: border-box;
  padding: 0 15px;
  background: #fff;
  &-hd { 
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding:10px 0;
  }
  &-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    flex:1;

  }
  &-brief {
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
  }
  &-price {
    font-size: 24px;
    color: #e60012;
    &-span {
      margin-left: 5px;
      font-size: 12px;
      text-decoration: line-through;
      color: #999;
    }
  }
  &-more {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 30px;
    &-item {
      flex: 1;
      font-size: 12px;
      color: #999;
    }
  }
  .btn-fav{
    box-sizing: border-box;
    display: inline-block;
    font-size: 12px;
    width:60px;
    text-align: center;
    padding:2px 10px;
    border-radius:10em;
    background-color: #fff;
    color: #666;
    border: 1px solid #ebedf0;
  }
  .btn-fav-danger{
    color: #f44;
    border: 1px solid #f44;
  }
}

.goods-content /deep/ img {
  max-width: 100% !important;
  height: auto !important;
}
.goods-content {
  box-sizing: border-box;
  background: #fff;
}

.goods-reputation {
  background: #fff;
  &-inner {
    padding: 0 15px;
    &-hd {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      font-size: 12px;
      color: #666;
    }
    &-media {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      background: #eee;
      margin-right: 5px;
    }
    &-name {
      flex: 1;
    }
    &-stars {
    }
    &-tag {
      padding: 2px 10px;
      border-radius: 10px;
      border: 1px solid #979797;
      font-size: 10px;
      color: #999;
      margin-right: 10px;
    }
    &-bd {
      padding: 10px 0;
    }
    &-ft {
      padding: 5px 0 10px;
      font-size: 14px;
      color: #999;
    }
  }
}
.service-desc {
  height: 70vh;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;
}
.popup-coupon {
  position: relative;
  padding-top: 44px;
  padding-bottom: 50px;
}
.coupon-list {
  padding: 10px 15px;
  max-height: 70vh;
  overflow-y: auto;
  &-header {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 0;
    left: 0;
    font-size: 14px;
    color: #333;
    padding: 10px 0;
    text-align: center;
  }
}
.coupon-list-item {
  box-sizing: border-box;
  height: 76px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #ffeeee;
  color: #ff4b52;
  margin-bottom: 10px;
  border-radius: 10px;
  &-hd {
    width: 100px;
    text-align: center;
    border-right: 1px slategrey #eee;
  }
  &-money {
    font-size: 24px;
    font-weight: bold;
    // margin-bottom:10px;
  }
  &-moneyHreshold {
    font-size: 12px;
  }
  &-bd {
    flex: 1;
  }
  &-name {
    font-size: 14px;
    padding: 5px 0;
  }
  &-dateEndDays {
    font-size: 12px;
    color: #d7a0a5;
  }
  &-btn {
    margin-right: 25px;
    display: inline-block;
    padding: 0.2em 0.5em;
    color: #fff;
    background: #ff4444;
    font-size: 10px;
    line-height: normal;
    border-radius: 0.8em;
  }
  &-btn-clicked {
    color: #ff4444;
    background: #ffffff;
    border: 1px solid #ff4444;
    pointer-events: none;
  }
}

/* 弹层*/
.popup {
  position: relative;
  padding-bottom: 50px;
  &-confirm {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  &-close {
    position: absolute;
    top: 10px;
    right: 15px;
    color: #969799;
    font-size: 20px;
    text-align: center;
  }
}
.side-bar{
  position:fixed;
  right: 15px;
  bottom:60px;
  z-index:99;
  min-height:80px;
  &-share,&-backtop{
    box-sizing: border-box;
    background: #fff; 
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #7d7e80;
    width: 32px;
    height: 32px; 
    box-shadow: 0 0 2px 3px hsla(0,0%,86.3%,.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.anim-scale {
    animation-name: anim-scale;
    animation-duration: .3s;
    animation-fill-mode: both;
}
@keyframes anim-scale {
    0% {
        opacity: .3;
        -ms-transform: scale(.5);
        transform: scale(.5)
    }

    100% {
        opacity: 1;
        -ms-transform: scale(1);
        transform: scale(1)
    }
}
</style>


