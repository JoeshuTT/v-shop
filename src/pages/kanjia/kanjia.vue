<template>
  <div class="container bgf">
    <div class="header">
      <div class="header-label" @click="onClickRule">玩法详情</div>
      <div class="header-hd">
        <div class="header-hd-avatar"><img :src="joiner.avatarUrl" alt=""></div>
        <div class="header-hd-nick">{{joiner.nick}}</div>
      </div>
      <div class="header-bd van-hairline--bottom mb10">「{{pageTitle}}」</div>
      <div class="header-ft">
        <div class="header-media"><img :src="goodsInfo.pic" alt=""></div>
        <div class="header-inner">
          <div class="header-title">
            <p class="header-title__value">{{goodsInfo.name}}</p>
            <p class="header-title__label" v-if="kanjiaInfo.status !== 1">仅剩:{{kanjiaSet.number - kanjiaSet.numberBuy}}件</p>
          </div>
          <div class="header-txt fz14" v-if="kanjiaSet.minPrice">最低价￥ {{kanjiaSet.minPrice | priceFormat}} <span class="ml5 ui-c-darker fz12 ui-text-deleted" v-if="kanjiaInfo.status !== 1">￥{{kanjiaSet.originalPrice | priceFormat}}</span></div>
        </div>
      </div>
    </div>
    <div class="section">
      <template v-if="kanjiaInfo.status === 0">
      <div class="section-header">砍价中</div>
      <div class="countdown">
        活动
        <div class="countdown-num" v-if="countdown.day !== '00'">{{countdown.day}}</div>
        <div class="countdown-splitor" v-if="countdown.day !== '00'">天</div>
        <div class="countdown-num" v-if="countdown.hour !== '00'">{{countdown.hour}}</div>
        <div class="countdown-splitor" v-if="countdown.hour !== '00'">小时</div>
        <div class="countdown-num" v-if="countdown.minute !== '00'">{{countdown.minute}}</div>
        <div class="countdown-splitor" v-if="countdown.minute !== '00'">分</div>
        <div class="countdown-num">{{countdown.second}}</div>
        <div class="countdown-splitor">秒</div>
        结束
      </div>
      <div class="progress">
        <div class="progress-min"><span class="fz10">￥</span>{{kanjiaSet.minPrice}}</div>
        <div class="progress-bar" ref="progressBar">
          <div class="progress-bar__portion" :style="'width:'+progressWidth+'px'">
            <div class="progress-bar__pivot" :style="'left:'+(progressWidth-50)+'px'">已砍了{{kanjiaSet.originalPrice - kanjiaInfo.curPrice | numberFormat}}元</div>
          </div>
        </div>
        <div class="progress-max"><span class="fz10">￥</span>{{kanjiaSet.originalPrice}}</div>
      </div>
      </template>
      <template v-if="kanjiaInfo.status === 1">
        <div class="section-header">砍价失败</div>
        <div class="countdown">
          很遗憾没有在规定时间内完成砍价
        </div>
      </template>
      <template v-if="kanjiaInfo.status === 2">
        <div class="section-header">恭喜你！已经砍到{{kanjiaInfo.curPrice | numberFormat}}元啦！</div>
        <div class="countdown">
          活动
          <div class="countdown-num" v-if="countdown.day !== '00'">{{countdown.day}}</div>
          <div class="countdown-splitor" v-if="countdown.day !== '00'">天</div>
          <div class="countdown-num" v-if="countdown.hour !== '00'">{{countdown.hour}}</div>
          <div class="countdown-splitor" v-if="countdown.hour !== '00'">时</div>
          <div class="countdown-num" v-if="countdown.minute !== '00'">{{countdown.minute}}</div>
          <div class="countdown-splitor" v-if="countdown.minute !== '00'">分</div>
          <div class="countdown-num">{{countdown.second}}</div>
          <div class="countdown-splitor">秒</div>
          结束
        </div>
        <div class="progress">
          <div class="progress-min"><span class="fz10">￥</span>{{kanjiaSet.minPrice}}</div>
          <div class="progress-bar" ref="progressBar">
            <div class="progress-bar__portion" :style="'width:'+progressWidth+'px'">
              <div class="progress-bar__pivot" :style="'left:'+(progressWidth-50)+'px'">已砍了{{kanjiaSet.originalPrice - kanjiaInfo.curPrice | numberFormat}}元</div>
            </div>
          </div>
          <div class="progress-max"><span class="fz10">￥</span>{{kanjiaSet.originalPrice}}</div>
        </div>
      </template>
      <div class="btn-group" v-if="isMy">
        <div class="btn-danger" v-if="kanjiaInfo.status === 0" @click="onShowActions">邀请好友帮忙砍</div>
        <div class="btn-outline" v-if="kanjiaInfo.status === 1" @click="onClickGoods">查看其他商品</div>
        <div class="btn-danger" v-if="kanjiaInfo.status === 2" @click="onClickBuy">{{kanjiaSet.minPrice}}元直接购买</div>
      </div>
      <div class="btn-group" v-else>
        <div class="btn-warning" @click="onClickKanjiaGoods">我也要砍价拿</div>
        <template v-if="kanjiaInfo.status === 0">
          <div class="btn-gray ml10" v-if="kanjiaHelp.uid">已砍过此商品</div>
          <div class="btn-danger ml10" @click="onhelpKanjia" v-else>帮好友砍一刀</div>
        </template>
      </div>
    </div>
    <div class="list">
      <div class="list-header">| 砍价记录 |</div>
      <template v-if="helps.length">
        <div class="list-item" v-for="(v,i) in helps" :key="i">
        <div class="list-item-media"><img :src="v.avatarUrl" alt=""></div>
        <div class="list-item-hd van-ellipsis">{{v.nick}}</div>
        <div class="list-item-bd">帮砍￥{{v.cutPrice}}</div>
      </div>
      </template>
      <template v-else>
        <div class="no-data">暂无砍价记录</div>
      </template>
    </div>
    <!-- 帮砍弹层  -->
    <van-popup v-model="showPopup" class="my-popup">
      <div class="my-popup-close" @click="onShowPopup"><van-icon name="clear"/></div>
      <div class="my-popup-header">你帮好友砍<span class="color-red">{{kanjiaHelp.cutPrice}}</span>元</div>
      <div class="my-popup-body">
        <div class="img-gold"></div>
        <div class="color-red mb20">你也获得发起砍价的资格</div>
      </div>
      <div class="btn-danger" @click="onClickKanjiaGoods">我也要{{kanjiaSet.minPrice | numberFormat}}元拿</div>
    </van-popup>
    <!-- 分享帮砍上拉选择框 -->
    <van-action-sheet
      v-model="showActions"
      :actions="actions"
      @select="onSelect"
    />
    <!-- 模拟点击复制链接 -->
    <div class="div1" @click="handleClipboard(pageLink,$event)"></div>
  </div>
</template>
<script>
var timer

import { storage, sessionStorage } from '@/common/util'
import { ActionSheet } from 'vant'
import clipboard from '@/common/clipboard'

export default {
  components: {
    [ActionSheet.name]: ActionSheet
  },
  data() {
    return {
      pageTitle: '发现一个好货，快来邀请好友砍价吧',
      pageLink: window.location.href,
      isMy: true, // 是否由该用户发起砍价
      countdown: {},
      endTime: '',
      progressWidth: 0,
      showPopup: false,
      showActions: false,
      actions: [
        { name: '邀请好友帮砍', subname: '复制页面链接' },
        { name: '生成邀请海报', subname: '待开发' }
      ],
      goodsInfo: {},
      kanjiaInfo: {},
      kanjiaSet: {},
      kanjiaHelp: {},
      joiner: {},
      helps: []
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
    this.getKanjiaInfo(this.$route.query.joiner, this.$route.query.kjid)
  },
  mounted() {

  },
  beforeDestroy() {
    clearTimeout(timer)
  },
  methods: {
    getKanjiaInfo(joiner, kjid, callbak = () => {}) {
      this.$request.get('/shop/goods/kanjia/info', { joiner, kjid }).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.kanjiaInfo = res.data.kanjiaInfo
        // res.data.kanjiaInfo.status  0 进行中，1 无效， 2 完成
        this.joiner = {
          nick: res.data.joiner.nick || '神秘用户',
          avatarUrl: res.data.joiner.avatarUrl || `${require('@/assets/avatar_default.png')}`
        }
        this.helps = res.data.helps.map(item => ({
          cutPrice: item.cutPrice,
          nick: item.nick || '神秘用户',
          avatarUrl: item.avatarUrl || `${require('@/assets/avatar_default.png')}`
        }))

        if (this.kanjiaInfo.uid !== storage.get('uid')) {
          // 检查是否由该用户发起砍价
          this.isMy = false
          this.pageTitle = '朋友一生一起走，帮砍一刀有没有'
        }

        this.$request.get('/shop/goods/kanjia/set', { goodsId: this.kanjiaInfo.goodsId }).then(res => {
          if (res.code === 700) {
            // this.kanjiaInfo.status = 1
            this.$dialog.confirm({
              title: '提示',
              message: '砍价活动已结束,去看看其他商品吧！',
              showCancelButton: false
            }).then(() => {
              // on confirm
              this.$router.replace({ path: '/home' })
            })
            return
          }
          if (res.code !== 0) {
            this.$toast(res.msg)
            return
          }
          const set = res.data
          this.kanjiaSet = res.data
          const time = +new Date(res.data.dateEnd.replace(/-/g, '/'))

          this.marketing = {
            type: 'kanjia',
            set,
            isBuy: true,
            info: {
              title: '砍价',
              time,
              label: '砍价享',
              minPrice: this.kanjiaSet.minPrice,
              originalPrice: this.kanjiaSet.originalPrice
            }
          }

          this.countdownInit()
          this.$nextTick(() => {
            const barWidth = this.$refs.progressBar.clientWidth
            const diff = this.kanjiaSet.originalPrice - this.kanjiaInfo.curPrice
            this.progressWidth = parseFloat((diff / (this.kanjiaSet.originalPrice - this.kanjiaSet.minPrice) * barWidth).toFixed(2))
          })
        })
        this.getGoodsDetail(this.kanjiaInfo.goodsId)

        this.$request.get('/shop/goods/kanjia/myHelp', { token: storage.get('token'), joinerUser: joiner, kjid }).then(res => {
          // 检查该用户是否帮忙砍过价
          if (res.code === 0) {
            this.kanjiaHelp = res.data
          }
          callbak()
        })
      })
    },
    getGoodsDetail(id) {
      this.$request.get('/shop/goods/detail', { id }).then(res => {
        this.goodsInfo = res.data.basicInfo
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
      const endTime = this.marketing.info.time
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
        this.countdown.tips = '倒计时结束'
        this.kanjiaInfo.status = 1
      }
    },
    onShowPopup() {
      this.showPopup = !this.showPopup
    },
    onShowActions() {
      // this.$router.push({path:'/kanjia/rule'})
      this.showActions = !this.showActions
    },
    onSelect(item) {
      this.showActions = false
      if (item.name === '邀请好友帮砍') {
        document.querySelector('.div1').click()
      }
      if (item.name === '生成邀请海报') {
        this.$toast(JSON.stringify(item))
      }
    },
    onClickKanjiaGoods() {
      this.$router.push({ path: '/goods-detail', query: { id: this.kanjiaInfo.goodsId }})
    },
    onClickGoods() {
      this.$router.push({ path: '/home' })
    },
    onClickBuy() {
      const goodsInfo = []
      goodsInfo.push({
        id: `${Date.now()}`,
        goodsId: this.goodsInfo.id,
        propertyChildIds: '',
        propTitle: '',
        price: this.kanjiaSet.minPrice,
        selectedNum: 1,
        messages: '',
        name: this.goodsInfo.name,
        characteristic: this.goodsInfo.characteristic,
        pic: this.goodsInfo.pic,
        marketing: { type: this.marketing.type, typeStr: this.marketing.info.title, kjid: this.kanjiaInfo.kjId }
      })
      sessionStorage.set('buyInfo', goodsInfo)
      this.$router.push({ path: '/order-submit', query: { type: 'buy' }})
    },
    onClickRule() {
      this.$router.push({ path: '/kanjia/rule' })
    },
    onhelpKanjia() {
      const kjid = this.kanjiaInfo.kjId
      const joinerUser = this.kanjiaInfo.uid
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0
      })
      this.$request.get('/shop/goods/kanjia/help', { token: storage.get('token'), joinerUser, kjid }).then(res => {
        if (res.code === 0) {
          this.getKanjiaInfo(this.$route.query.joiner, this.$route.query.kjid, () => {
            this.$toast.clear()
            this.onShowPopup()
          })
        } else {
          this.$toast(res.msg)
        }
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
.progress{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom:55px;
  &-min,&-max{
    font-size: 20px;
    color:#000;
  }
  .progress-bar{
    flex:1;
    height:8px;
    margin:0 10px;
    background:rgba(255,112,61,.3);
    border-radius:4px;
    &__portion{
      position: relative;
      height:8px;
      background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
      border-radius:4px;
      transition: width .5s;
    }
    &__pivot{
      position: relative;
      z-index:10;
      left:0;
      top:20px;
      display: inline-block;
      width: 100PX;  // 固定宽度,不然上面箭头对不齐进度条
      text-align:center;
      font-size: 12px;
      color:#fff;
      line-height:2;
      border-radius:6px;
      background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
      transition: left .5s;
    }
    &__pivot::after{
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      top: -4PX;
      left: 50%;
      margin-left:-2PX;
      border-width: 0 4PX 4PX;
      border-style: solid;
      border-color: transparent transparent #FF703D;
    }
  }
}
.btn-group{
  .flex();
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
.btn-warning{
  color:#f44;
  background:linear-gradient(309deg,rgb(250, 198, 36,1) 0%,rgba(248, 211, 49,1) 100%);
}
.btn-gray{
  color:#fff;
  background:#999;
}
.btn-outline{
  color:#ff703d;
  border:1px solid #ff703d;
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
.list{
  &-header{
    font-size: 16px;
    color: #333;
    text-align:center;
    font-weight:bold;
  }
  &-item{
    padding:12px 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color:#333;
    font-size: 14px;
    &-media{
      width:32px;
      height:32px;
      margin-right:10px;
      overflow: hidden;
      border-radius:50%;
    }
    &-hd{
      flex:1;
      width: 0;
    }
    &-bd{
      font-size: 12px;

    }
  }
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
.no-data{
  font-size: 14px;
  color:#999;
  text-align:center;
  padding:20px 0;
}

@keyframes heartBeat {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    50% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1)
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

</style>

