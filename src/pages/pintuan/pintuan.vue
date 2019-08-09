<template>
  <div class="container bgf">
    <div class="header">
      <div class="header-label" @click="onClickRule">玩法详情</div>
      <!-- <div class="header-hd">
        <div class="header-hd-avatar"><img :src="joiner.avatarUrl" alt=""></div>
        <div class="header-hd-nick">{{joiner.nick}}</div>
      </div> -->
      <!-- <div class="header-bd van-hairline--bottom mb10">「{{pageTitle}}」</div> -->
      <div class="header-bd mb10"></div>
      <div class="header-ft">
        <div class="header-media"><img :src="basicInfo.pic" alt=""></div>
        <div class="header-inner">
          <div class="header-title">
            <div class="header-title__value">{{basicInfo.name}}</div>
            <div class="header-title__value" v-if="marketing.set">已有{{marketing.set.numberSucccess}}人拼团成功</div>
          </div>
          <div class="header-txt fz14" v-if="marketing.set">
            {{marketing.set.numberPersion}}人成团价￥{{basicInfo.pingtuanPrice | numberFormat}}
            <span class="ml5 ui-c-darker fz12 ui-text-deleted">￥{{basicInfo.originalPrice | numberFormat}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <template v-if="pintuanStatus === 0">
      <div class="section-header">拼团剩余时间</div>
      <div class="countdown">
        <div class="countdown-num" v-if="countdown.day !== '00'">{{countdown.day}}</div>
        <div class="countdown-splitor" v-if="countdown.day !== '00'">天</div>
        <div class="countdown-num" v-if="countdown.hour !== '00'">{{countdown.hour}}</div>
        <div class="countdown-splitor" v-if="countdown.hour !== '00'">时</div>
        <div class="countdown-num" v-if="countdown.minute !== '00'">{{countdown.minute}}</div>
        <div class="countdown-splitor" v-if="countdown.minute !== '00'">分</div>
        <div class="countdown-num">{{countdown.second}}</div>
        <div class="countdown-splitor">秒</div>
      </div>
      <div class="pintuan-inner" v-if="joiners.length">
      <div class="pintuan-inner-avatar"><img :src="joiners[joiners.length-1].avatarUrl" alt=""><div class="pintuan-inner-avatar__tag">团长</div></div>
        <!-- <div class="pintuan-inner-avatar pintuan-inner-avatar--empty"><van-icon name="plus" /></div> -->
        <!-- <div class="nick ml10">{{joiners[joiners.length-1].nick}}</div> -->
      </div>
      <div class="joiner">
        <!-- <div class="joiner-list">
          <div class="joiner-list-item"></div>
          <div class="joiner-list-item"></div>
        </div> -->
        <router-link class="joiner-load-more" :to="'/pintuan/joiner?id='+$route.query.tuanId">查看全部团员</router-link>
      </div>
      <div class="fz16 ui-center mb10" v-if="marketing.set">还差{{marketing.set.numberPersion - joiners.length}}人，即可拼团成功</div>
      </template>
      <template v-if="pintuanStatus === 1">
        <div class="section-header">{{pintuanTitle}}</div>
      </template>
      <template v-if="pintuanStatus === 2">
        <div class="section-header">{{pintuanTitle}}</div>
      </template>
      <template v-if="isMy">
        <div class="btn-group" v-if="pintuanStatus === 0">
          <div class="btn-danger mb10" @click="onShowActions">邀请好友参团</div>
          <div class="btn-outline" v-if="orderId" @click="onClickOrder(orderId)">查看订单详情</div>
        </div>
        <div class="btn-group" v-if="pintuanStatus === 1">
          <div class="btn-danger mb10" @click="onClickGoods">重新开团</div>
          <div class="btn-outline" @click="onClickHome">进店逛逛</div>
        </div>
        <div class="btn-group" v-if="pintuanStatus === 2">
          <div class="btn-danger mb10" v-if="orderId" @click="onClickOrder(orderId)">查看订单详情</div>
          <div class="btn-outline" @click="onClickHome">进店逛逛</div>
        </div>
      </template>
      <template v-else>
        <div class="btn-group" v-if="pintuanStatus === 0">
          <div class="btn-danger" @click="onClickGoods">立即参团</div>
        </div>
        <div class="btn-group" v-if="pintuanStatus === 1">
          <div class="btn-danger mb10" @click="onClickGoods">开个新团</div>
          <div class="btn-outline" @click="onClickHome">进店逛逛</div>
        </div>
        <div class="btn-group" v-if="pintuanStatus === 2">
          <div class="btn-danger mb10" @click="onClickGoods">开个新团</div>
          <div class="btn-outline" @click="onClickHome">进店逛逛</div>
        </div>
      </template>
    </div>
    <!-- 分享帮砍上拉选择框 -->
    <van-action-sheet
      v-model="showActions"
      :actions="actions"
      @select="onSelect"
    />
    <!-- 商品规格弹层 -->
    <van-sku
      hide-quota-text
      v-model="showSku"
      :sku="skuData.sku"
      :goods="skuData.goods_info"
      :goods-id="skuData.goods_id"
      :hide-stock="skuData.sku.hide_stock"
      :quota="skuData.quota"
      :quota-used="skuData.quota_used"
      :show-add-cart-btn="skuData.show_add_cart_btn"
      :buy-text="skuData.buy_text"
      @buy-clicked="onBuyClicked"
      @sku-selected="onSkuSelected" >
        <!-- 自定义 sku-header-price -->
      <template slot="sku-header-price" slot-scope="props">
        <div class="van-sku__goods-price" style="text-decoration:line-through;color:#999;">
          <span class="van-sku__price-symbol">￥</span><span class="van-sku__price-num">{{ props.price }}</span>
        </div>
        <div class="van-sku__goods-price">
          <!-- {{ marketing.info.label }} -->
          ￥<span class="van-sku__price-num">{{ basicInfo.pingtuanPrice }}</span>
        </div>
      </template>
      </van-sku>
      <!-- 模拟点击复制链接 -->
      <div class="div1" @click="handleClipboard(pageLink,$event)"></div>
  </div>
</template>
<script>
var timer

import { storage, sessionStorage } from '@/common/util'
import { ActionSheet, Sku } from 'vant'
import clipboard from '@/common/clipboard'

export default {
  components: {
    [ActionSheet.name]: ActionSheet,
    [Sku.name]: Sku
  },
  data() {
    return {
      pageLink: window.location.href,
      orderId: '',
      marketing: {},
      pintuanStatus: 0,
      pintuanTitle: '',
      isMy: true, // 是否由该用户发起拼团
      countdown: {},
      endTime: '',
      showActions: false,
      actions: [
        { name: '邀请好友成团', subname: '分享页面链接' },
        { name: '生成邀请海报', subname: '待开发' }
      ],
      basicInfo: {},
      properties: [],
      pintuanInfo: {},
      joiners: [],
      helps: [],
      showSku: false,
      currentPintuan: {},
      propTitle: '选择',
      skuData: {
        goods_id: '',
        quota: 0, // 0表示不限购
        quota_used: 0,
        goods_info: {},
        show_add_cart_btn: false,
        buy_text: '确定',
        sku: {
          price: '1.00', // 默认价格（单位元）
          stock_num: 100, // 商品总库存
          none_sku: false, // 是否无规格商品
          hide_stock: false, // 是否隐藏剩余库存
          collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
          tree: [],
          list: [],
          messages: []
        }
      }
    }
  },
  filters: {
    numberFormat(val) {
      return parseFloat(Number(val).toFixed(2))
    },
    priceFormat(val) {
      return parseFloat(Number(val)).toFixed(2)
    }
  },
  created() {
    this.getPintuanInfo(this.$route.query.tuanId, this.$route.query.goodsId)
    this.currentPintuan.id = this.$route.query.tuanId
  },
  beforeDestroy() {
    clearTimeout(timer)
  },
  methods: {
    getPintuanInfo(tuanId, goodsId) {
      this.$request.get('/shop/goods/pingtuan/set', { goodsId }).then(res => {
        if (res.code !== 0) {
          return
        }
        const set = res.data
        this.marketing = {
          type: 'pintuan',
          set,
          isBuy: true,
          info: {
            title: '拼团',
            time: new Date(set.dateEnd.replace(/-/g, '/')).getTime(),
            label: `${set.numberPersion}人拼团价`
            // minPrice:this.basicInfo.pingtuanPrice,
            // originalPrice:this.basicInfo.originalPrice,
          }
        }
        this.getGoodsDetail(goodsId)
        this.checkIsmyPintuan(this.$route.query.tuanId)
        this.$request.get('/shop/goods/pingtuan/joiner', { tuanId }).then(res => {
          switch (res.code) {
            case 10000:
              // msg：当前拼团超时未成团，已失效
              this.pintuanStatus = 1
              this.pintuanTitle = '拼团失败'
              break
            case 20000:
              // msg：当前拼团已成团
              this.pintuanStatus = 2
              this.pintuanTitle = '拼团成功'
              break
            case 0:
              // msg：拼团进行中
              this.pintuanStatus = 0
              break
            default:
              this.$toast(res.msg)
              break
          }
          if (res.code !== 0) {
            // this.$toast(res.msg)
            // 拼团只有在进行中才会返回相关数据
            // this.$dialog.confirm({
            //   title: '提示',
            //   message: `${res.msg}`,
            //   showCancelButton:false,
            //   confirmButtonText:'进店逛逛'
            // }).then(() => {
            //   // on confirm
            //   this.$router.replace({path:'/home'})
            // })
            return
          }

          this.joiners = res.data.map(item => ({
            nick: item.apiExtUserHelp.nick || '神秘用户',
            avatarUrl: item.apiExtUserHelp.avatarUrl || `${require('@/assets/avatar_default.png')}`,
            dateAdd: item.dateAdd,
            uidHelp: item.uidHelp
          }))
          // 拼团剩余时间
          const endTime = new Date(this.joiners[this.joiners.length - 1].dateAdd.replace(/-/g, '/')).getTime() + set.timeoutHours * 60 * 60 * 1000
          this.endTime = endTime
          this.countdownInit()
        })
      })
    },
    checkIsmyPintuan(tuanId) {
      // 判断是否是该用户参与的 拼团
      this.$request.post('/shop/goods/pingtuan/my-join-list', { token: storage.get('token'), tuanId }).then(res => {
        // 对已参团的情况暂时未处理，提交订单时后端会检查并提示，您已经参与本次团购，请勿重复下单
        if (res.code === 700) {
          this.isMy = false
          this.orderId = ''
        }
        if (res.code === 0) {
          this.orderId = res.data.result[0].buyInfo.orderId
          this.isMy = true
          return
        }
      })
    },
    getGoodsDetail(id) {
      this.$request.get('/shop/goods/detail', { id }).then(res => {
        this.basicInfo = res.data.basicInfo
        this.properties = res.data.properties || []

        this.marketing.info.minPrice = this.basicInfo.pingtuanPrice
        this.marketing.info.originalPrice = this.basicInfo.originalPrice

        if (this.pintuanStatus !== 2) {
          this.initSkuData(this.properties, this.basicInfo)
        }
      })
    },
    countdownInit() {
      timer = setTimeout(() => {
        this.countdownTimer()
      }, 1000)
    },
    countdownTimer() {
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      const endTime = this.endTime
      const gapTime = Math.ceil((endTime - Date.now()) / 1000)
      if (gapTime > 0) {
        let lastTime = gapTime % 86400
        const day = Math.floor(gapTime / 86400)
        const hour = Math.floor(lastTime / 3600)
        lastTime = lastTime % 3600
        const minute = Math.floor(lastTime / 60)
        const second = Math.floor(lastTime % 60)
        // const countdown = `${day}天${hour}时${minute}分${second}秒`
        this.countdownInit()
        const countdown = { day, hour, minute, second }
        for (const num in countdown) {
          countdown[num] = formatNumber(countdown[num])
        }
        this.countdown = countdown
      } else {
        // 倒计时结束
        this.pintuanStatus = 1
        this.$dialog.confirm({
          title: '提示',
          message: `该拼团活动已结束`,
          showCancelButton: false,
          confirmButtonText: '进店逛逛'
        }).then(() => {
          // on confirm
          this.$router.replace({ path: '/home' })
        })
      }
    },
    onShowActions() {
      this.showActions = !this.showActions
    },
    onSelect(item) {
      this.showActions = false
      if (item.name === '邀请好友成团') {
        document.querySelector('.div1').click()
      }
      if (item.name === '生成邀请海报') {
        this.$toast(JSON.stringify(item))
      }
    },
    onClickOrder(orderId) {
      this.$router.push({ path: '/order-detail', query: { id: orderId }})
    },
    onClickGoods() {
      // this.$router.push({path:'/goods-detail',query:{id:this.pintuanInfo.goodsId}})
      if (this.marketing.info.time < Date.now()) {
        this.$toast('当前砍价活动已结束,去看看其他商品吧')
        return
      }
      this.showSku = !this.showSku
    },
    onClickHome() {
      this.$router.replace({ path: '/home' })
    },
    onBuyClicked(data) {
      // copy
      console.log(data)
      // 立即购买商品数据定义格式
      const goodsInfo = []
      if (this.properties.length) {
        goodsInfo.push({
          id: `${Date.now()}`,
          goodsId: data.goodsId,
          propertyChildIds: data.selectedSkuComb.propertyChildIds,
          propTitle: this.propTitle.replace('已选 ', ''),
          price: parseFloat((data.selectedSkuComb.price / 100).toFixed(2)),
          selectedNum: data.selectedNum,
          messages: data.messages,
          name: this.basicInfo.name,
          characteristic: this.basicInfo.characteristic,
          pic: this.basicInfo.pic,
          marketing: {} // 商品活营销动相关数据都存在此对象下
        })
      } else {
        goodsInfo.push({
          id: `${Date.now()}`,
          goodsId: data.goodsId,
          propertyChildIds: '',
          propTitle: this.propTitle.replace('已选 ', ''),
          price: this.basicInfo.minPrice,
          selectedNum: data.selectedNum,
          messages: data.messages,
          name: this.basicInfo.name,
          characteristic: this.basicInfo.characteristic,
          pic: this.basicInfo.pic,
          marketing: {}
        })
      }
      // 拼团购买
      if (this.marketing.type === 'pintuan' && this.marketing.isBuy) {
        goodsInfo[0].price = this.marketing.info.minPrice
        goodsInfo[0].marketing = { type: this.marketing.type, typeStr: this.marketing.info.title, pingtuanOpenId: this.currentPintuan.id ? this.currentPintuan.id : 0 }
      }
      sessionStorage.set('buyInfo', goodsInfo)
      this.$router.push({ path: '/order-submit', query: { type: 'buy' }})
    },
    onClickRule() {
      this.$router.push({ path: '/pintuan/rule' })
    },
    initSkuData(properties, basicInfo) {
      // copy
      // 商品规格sku数据
      const tree = properties.map((item, index) => ({
        k: item.name,
        k_id: item.id,
        v: item.childsCurGoods,
        k_s: 's' + (index + 1),
        count: item.childsCurGoods.length
      }))

      this.skuData.goods_info = {
        title: basicInfo.name,
        picture: basicInfo.pic
      }

      this.skuData.goods_id = basicInfo.id // 商品id
      this.skuData.sku.price = basicInfo.minPrice.toFixed(2) // 默认价格（单位元）
      this.skuData.sku.stock_num = basicInfo.stores // 商品总库存
      this.skuData.sku.tree = tree

      // 商品无规格
      if (tree.length === 0) {
        this.propTitle = ''
        this.skuData.none_sku = true
        // this.skuData.collection_id= 2261
        return
      }

      // 商品多个规格
      this.propTitle = `选择 ${tree.reduce((total, item) => total + ' ' + item.k, '')}`
      if (tree.length > 0) {
        /**
         * 生成笛卡尔积
         * @returns {*}
         */
        const descartes = function(array) {
          if (array.length < 2) return array[0] || []

          return [].reduce.call(array, function(col, set) {
            var res = []
            col.forEach(function(c) {
              set.forEach(function(s) {
                var t = [].concat(Array.isArray(c) ? c : [c])
                t.push(s)
                res.push(t)
              })
            })
            return res
          })
        }
        const calc = descartes(Array.prototype.concat.apply([], tree.map(item => [item.v])))
        this.skuData.sku.list = calc.map(item => {
          const obj = {
            price: parseFloat((basicInfo.minPrice * 100).toFixed(2)), // 价格（单位分）
            stock_num: basicInfo.stores // 当前 sku 组合对应的库存
          }
          if (Array.isArray(item)) {
            // 2种规格以上
            item.forEach((v, i) => {
              obj[`s${i + 1}`] = v.id
              obj.propertyChildIds = `${obj.propertyChildIds || ''}${v.propertyId}:${v.id},`
              obj.id = `${obj.id || ''}${v.propertyId}${v.id}`
            })
            return obj
          } else {
            // 只有一种规格的情况下
            obj['s1'] = item.id
            obj.propertyChildIds = `${item.propertyId}:${item.id},`
            obj.id = `${item.propertyId}${item.id}`
            return obj
          }
        })
      }
    },
    onSkuSelected(data) {
      // copy
      console.log(data)
      if (data.selectedSkuComb) {
        const title = []
        this.properties.forEach((item, index) => {
          const current = item.childsCurGoods.find(v => v.id === data.selectedSku[`s${index + 1}`])
          title.push(current.name)
        })
        this.propTitle = `已选 ${title.join(',')}`
        this.getGoodsPrice(this.basicInfo.id, data.selectedSkuComb.propertyChildIds, (res) => {
          if (this.marketing.type === 'pintuan') {
            this.marketing.info.minPrice = res.data.pingtuanPrice
            this.marketing.info.originalPrice = res.data.originalPrice
          }

          this.basicInfo.minPrice = res.data.price
          this.basicInfo.originalPrice = res.data.originalPrice
          this.basicInfo.pingtuanPrice = res.data.pingtuanPrice
          this.basicInfo.stores = res.data.stores

          data.selectedSkuComb.price = parseFloat((res.data.price * 100).toFixed(2)) // 价格（单位分）
          data.selectedSkuComb.stock_num = res.data.stores
          data.selectedSkuComb.propertyChildIds = res.data.propertyChildIds
        })
      }
    },
    getGoodsPrice(goodsId, propertyChildIds, callback) {
      // copy
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
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style lang="less" scoped>

@border-radius: 25px;

.flex(){
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.round-img(@width){
  width:@width;
  height:@width;
  border-radius:50%;
  overflow:hidden;
}
.header{
  position:relative;
  box-sizing: border-box;
  font-size: 14px;
  color:#fff;
  padding:15px 15px 50px;
  // height:200px;
  background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
  &-label{
    position:absolute;
    top:20px;
    right:0;
    border-radius: 1em 0 0 1em;
    background:rgba(255, 255, 255, .3);
    font-size: 10px;
    padding:2px 8px;
  }
  &-hd{
    text-align:center;
    font-size: 14px;
    &-avatar{
      .round-img(60px);
      margin:0 auto;
    }
    &-nick{
      font-weight:bold;
    }
  }
  &-bd{
    font-size: 16px;
    line-height: 28px;
    text-align:center;
  }
  &-ft{
    .flex()
  }
  &-inner{
    flex:1;
    height:100px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
  }
  &-title{
    font-size: 14px;
    margin-bottom:10px;
    max-width:170px;
    p{
      margin-bottom: 5px;
    }
    &__label{
      display: inline-block;
      font-size: 12px;
      border:1px solid #fff;
      border-radius: 1em;
      padding:2px 10px;
    }
  }
  &-media{
    margin-right:15px;
    width:100px;
    height:100px;
    border-radius:6px;
    overflow:hidden;
  }
}
.section{
  position: relative;
  padding:25px 28px 30px;
  margin:-30px 10px 25px 10px;
  box-shadow:0px 4px 5px 2px rgba(237,237,237,0.5);
  border-radius:10px;
  background:#fff;
  color:#000;
  &-header{
    font-size: 18px;
    font-weight:bold;
    text-align:center;
    margin-bottom:15px;
  }
}
.countdown{
  display:flex;
  justify-content: center;
  align-items: center;
  text-align:center;
  font-size: 14px;
  color: #000;
  margin-bottom:15px;
  &-num{
    // font-size: 12px;
    box-sizing:border-box;
    min-width: 24px;
    padding:2px 5px;
    margin:0 5px;
    background:rgba(255,112,61,.3);
    color:#FF4141;
    border-radius:4px;
    font-weight:bold;
  }
  &-splitor{

  }
}

.btn-group{
  // .flex();
}
.btn-danger,.btn-warning,.btn-gray,.btn-outline{
  flex:1;
  box-sizing: border-box;
  width:100%;
  display:inline-block;
  border-radius:@border-radius;
  text-align:center;
  padding:12px 0;
  font-size: 14px;
}
.btn-danger{
  color:#fff;
  background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
  animation: heartBeat 1s ease infinite;
}
.btn-outline{
  color:#ff703d;
  border:1px solid #ff703d;
}
.btn-warning{
  color:#f44;
  background:linear-gradient(309deg,rgb(250, 198, 36,1) 0%,rgba(248, 211, 49,1) 100%);
}
.btn-gray{
  color:#fff;
  background:#999;
}
.my-badge{
  margin-left:10px;
  display:inline-block;
  border-radius:10px;
  text-align:center;
  padding:2px 10px;
  font-size: 10px;
  color:#fff;
  background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
}

.color-red{
  color:#E60012;
}
.img-gold{
  width:88px;
  height:86px;
  background:url(../../assets/mall_gold@2x.png) no-repeat;
  background-size:cover;
  margin:0 auto 20px;
}
.pintuan-inner{
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-bottom:10px;
  &-avatar+&-avatar{
    margin-left:10px;
  }
  &-avatar{
    position: relative;
    box-sizing: border-box;
    width:60px;
    height:60px;
    border-radius:50%;
    overflow:hidden;
    border:1px solid #c0c0c0;
    &__tag{
    position: absolute;
    left:0;
    bottom:0;
    background:#ff703d;
    width:100%;
    font-size: 10px;
    color:#fff;
    text-align:center;
    // border-radius:1em;
  }
    &--empty{
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.my-popup{
  box-sizing: border-box;
  background:#fff;
  padding:25px 46px;
  text-align:center;
  width:260px;
  border-radius:16px;
  &-header{
    font-weight: bold;
    color:#1A1A1A;
    font-size: 16px;
    padding:10px 0;
  }
  &-close{
    position: absolute;
    top:15px;
    right:15px;
    font-size: 22px;
    color:#bfbfbf;
  }
}
.joiner{
  text-align:center;
  &-load-more{
    margin: 10px auto 20px;
    display: inline-block;
    border-radius: 25px;
    text-align: center;
    padding: 4px 10px;
    color: #ff703d;
    border: 1px solid #ff703d;
    font-size: 12px;
  }
}

.no-data{
  font-size: 14px;
  color:#999;
  text-align:center;
  padding:20px 0;
}

</style>

