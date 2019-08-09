<template>
  <div class="container pd50">
    <!-- <form action="/">
            <van-search
                v-model="value"
                placeholder="请输入搜索关键词"
                show-action
                @search="onSearch"
                @cancel="onCancel"
            />
        </form> -->
    <van-swipe :autoplay="3000" indicator-color="white" class="home-swiper">
      <van-swipe-item v-for="item in banner" :key="item.id">
        <img :src="item.picUrl" :alt="item.title" />
      </van-swipe-item>
    </van-swipe>
    <div class="main">
      <div class="section-header common-h2" v-if="listKanjia.length"><span class="common-h2-title">疯狂砍价</span></div>
      <div class="list">
        <van-row>
          <van-col span="12" v-for="item in listKanjia" :key="item.id">
            <div class="list-item" @click="onDetailClick(item.id)">
              <img class="list-item-img" :src="item.pic" :alt="item.name">
              <div class="list-item-hd van-ellipsis">{{item.name}}</div>
              <div class="list-item-bd"><span class="ui-c-red">￥{{item.kanjiaPrice}}</span><span class="ui-c-dark ui-text-deleted">￥{{item.originalPrice}}</span></div>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="section-header common-h2"><span class="common-h2-title">全民拼团</span></div>
      <div class="list">
        <van-row>
          <van-col span="12" v-for="(item,index) in listPintuan" :key="item.id">
            <div class="list-item" @click="onDetailClick(item.id)">
              <!-- <div class="list-item-tag" v-if="pintuanSets.length">{{pintuanSets[index].numberSucccess}}人已成团</div> -->
              <img class="list-item-img" :src="item.pic" :alt="item.name">
              <div class="list-item-hd van-ellipsis">{{item.name}}</div>
              <div class="list-item-ft">
                <div class="ui-c-red" v-if="pintuanSets.length"><span class="fz12">{{pintuanSets[index].numberPersion}}人团</span> ￥{{item.pingtuanPrice}}</div>
                <div class="ui-c-gray-dark fz12">单买价￥{{item.minPrice}}</div>
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="section-header common-h2"><span class="common-h2-title">商品列表</span></div>
      <div class="list">
        <van-row>
          <van-col span="12" v-for="item in list" :key="item.id">
            <div class="list-item" @click="onDetailClick(item.id)">
              <div class="list-item-tag" v-if="item.recommendStatus">推荐</div>
              <img class="list-item-img" :src="item.pic" :alt="item.name">
              <div class="list-item-hd van-ellipsis">{{item.name}}</div>
              <div class="list-item-bd"><span class="ui-c-red">￥{{item.minPrice}}</span>
              <!-- <span class="ui-c-dark ui-text-deleted">￥{{item.originalPrice}}</span> -->
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
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
import { Tabbar, TabbarItem, Swipe, SwipeItem, Search } from 'vant'
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Search.name]: Search
  },
  data() {
    return {
      active: 0,
      images: [],
      value: '',
      banner: [],
      list: [],
      listKanjia: [],
      listPintuan: [],
      pintuanSets: {},
      goodsMap: {}
    }
  },
  created() {
    this.getBannerList()
    this.getGoodsList()
    this.getGoodsKjList()
    this.getGoodsPtList()
  },
  methods: {
    onSearch() { },
    onCancel() { },
    getGoodsList() {
      this.$request.post('/shop/goods/list', { kanjia: false, pingtuan: false }).then(res => {
        this.list = res.data || []
      })
    },
    getGoodsKjList() {
      this.$request.post('/shop/goods/list', { kanjia: true }).then(res => {
        if (res.code !== 0) {
          return
        }
        // this.goodsMap = res.data.goodsMap
        this.listKanjia = res.data || []
        this.listKanjia = this.listKanjia.filter(item => item.kanjia && item.kanjiaPrice)
      })
    },
    getGoodsPtList() {
      this.$request.post('/shop/goods/list', { pingtuan: true }).then(res => {
        if (res.code !== 0) {
          return
        }
        this.listPintuan = res.data || []
        const goodsIdArr = this.listPintuan.map(v => v.id).join()
        this.$request.get('/shop/goods/pingtuan/sets', { goodsId: goodsIdArr }).then(res => {
          this.pintuanSets = res.data
        })
      })
    },
    getBannerList() {
      this.$request.get('/banner/list', { type: 'indexBanner' }).then(res => {
        this.banner = res.data
      })
    },
    onDetailClick(id) {
      this.$router.push({ path: '/goods-detail', query: { id }})
    }
  }
}
</script>
<style lang="less" scoped>

.home-swiper,.home-swiper img {
  width: 100%;
  height: 188px;
}
.common-h2 {
  background: none;
}
.list {
  padding-left: 5px;
  padding-right: 5px;
  .van-col {
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 10px;
  }

  &-item {
    position:relative;
    text-align: left;
    overflow: hidden;
    background: #fff;
    // border-radius: 8px;
    // box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);
  &-tag {
    position: absolute;
    top: 15px;
    left: 0;
    background-color: #f44;
    display: inline-block;
    padding: 0.2em 0.5em;
    color: #fff;
    font-size: 10px;
    line-height: normal;
    border-radius: 0 0.8em 0.8em 0;
    padding-right: 0.6em;
  }
  &-img {
    display: block;
    width: 100%;
    height: 160px;
  }
  &-hd {
    padding: 10px 10px 0;
    font-size: 14px;
    color: #333;
    font-size: 14px;
    // margin-bottom: 5px;
  }
  &-ft{
        padding: 10px 10px;
    display: block;
    font-size: 14px;
  }
  &-bd {
    padding: 10px 10px;
    display: block;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
  }
  }
  &-item:nth-child(even) {
    // margin-left:
  }

}
</style>
