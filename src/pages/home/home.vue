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
    <van-swipe :autoplay="3000"
      indicator-color="white"
      class="home-swiper">
      <van-swipe-item v-for="item in banner"
        :key="item.id">
        <img :src="item.picUrl"
          :alt="item.title" />
      </van-swipe-item>
    </van-swipe>
    <div class="main">
      <div class="section">
        <div class="section-header common-h2"><span class="common-h2-title">商品列表</span></div>
        <div class="section-body">
          <van-row class="goods-list">
            <van-col span="12"
              v-for="item in list"
              :key="item.id"
              style="padding-left:5px;padding-right:5px;">
              <router-link :to="'/goods-detail?id='+item.id"
                class="goods-list-item">
                <img class="goods-list-img"
                  :src="item.pic"
                  :alt="item.name">
                <div class="goods-list-hd van-ellipsis">{{item.name}}</div>
                <div class="goods-list-bd"><span class="ui-c-red">￥{{item.minPrice}}</span><span class="ui-c-dark ui-text-deleted">￥{{item.originalPrice}}</span></div>
              </router-link>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <!-- <load-more tip="暂无数据" :loading="false"/> -->
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
import { Tabbar, TabbarItem, Swipe, SwipeItem, Search, } from 'vant'
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Search.name]: Search,
  },
  data() {
    return {
      active: 0,
      images: [],
      value: '',
      banner: [],
      list: [],
    };
  },
  created() {
    this.getGoodsList()
    this.getBannerList()
  },
  methods: {
    onSearch() { },
    onCancel() { },
    getGoodsList() {
      this.$request.post('/shop/goods/list', {}).then(res => {
        this.list = res.data
      })
    },
    getBannerList() {
      this.$request.get('/banner/list', { type: 'indexBanner' }).then(res => {
        this.banner = res.data
      })
    },
  }
};
</script>
<style lang="less">
.home-swiper {
  width: 100%;
  height: 188px;
}
.section {
  // margin: 0 15px;
}
.section-header {

}
.goods-list {
  padding: 10px 15px;
  box-sizing: border-box;
  background: #fff;
  &-item {
    background: #fff;
    text-align: center;
    overflow: hidden;
    box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);
    border-radius: 8px;
    margin-bottom: 10px;
    text-align: left;
  }
  &-item:nth-child(even) {
    // margin-left:
  }
  &-img {
    display: block;
    width: 100%;
    height: 160px;
    background: #eee;
  }
  &-hd {
    padding: 10px 10px 0;
    font-size: 14px;
    color: #333;
    font-size: 14px;
    // margin-bottom: 5px;
  }
  &-bd {
    padding: 10px 10px;
    display: block;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
