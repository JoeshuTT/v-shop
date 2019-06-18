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
            <div class="section">
            <div class="section-header common-h2"><span class="common-h2-title">商品列表</span></div>
            <div class="section-body">
                <van-row class="goods-list">
                    <van-col span="12" v-for="item in list" :key="item.id" style="padding-left:5px;padding-right:5px;">
                        <router-link :to="'/goods-detail?id='+item.id" class="goods-list-item">
                            <img  class="goods-list-img" :src="item.pic" :alt="item.name">
                        <div class="goods-list-hd">{{item.name}}</div>
                        <div class="goods-list-bd"><span class="ui-c-red">￥{{item.minPrice}}</span><span class="ui-c-dark ui-text-deleted">￥{{item.originalPrice}}</span></div>
                        </router-link>
                    </van-col>
                </van-row>
            </div>
        </div>
        </div>
        <load-more tip="暂无数据" :loading="false"/>
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
import { Tabbar, TabbarItem,Swipe, SwipeItem,Search, } from "vant";
import loadMore from '@/components/load-more'
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Search.name]: Search,
    loadMore: loadMore,
  },
  data() {
    return {
      active: 0,
      images: [
        'https://img.yzcdn.cn/1.jpg',
        'https://img.yzcdn.cn/2.jpg'
      ],
      value:'',
      banner:[],
      list:[],
    };
  },
  created(){
    console.dir(this.$router)
    this.getGoodsList()
    this.getBannerList()
    // this.$request.get('/shop_api/shop/goods/category/all').then(res=>{
    //   console.log(res)
    // })
    // this.$request.post('/shop_api/shop/goods/list',{categoryId:37962}).then(res=>{
    //   console.log(res)
    // })
    // this.$request.get('/shop_api/shop/goods/detail',{id:139100}).then(res=>{
    //   console.log(res)
    // })

    // this.$request({method: 'post',url: '/shop_api/shop/goods/list',headers: {  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},data: { categoryId: 37962 },params: { categoryId: 37962 }}).then(data=> {console.log(data)     })
  },
  mounted() {

  },
  methods: {
onSearch(){},
onCancel(){},
    getGoodsList(){
      this.$request.post('/shop/goods/list',{}).then(res=>{
        this.list = res.data
      })
    },
    getBannerList(){
      this.$request.get('/banner/list',{type:'index_banner'}).then(res=>{
        this.banner = res.data
      })
    },
  }
};
</script>
<style lang="less">
@import '~@/common/styles/variables.less';
.home-swiper{
    width:100%;
    height:200px;
}
.section{
    // margin: 0 15px;
    
}
.section-header{
 
}
.goods-list{
    padding:10px 15px;
    box-sizing: border-box;
    background: #fff;
    &-item{
        background: #fff;
        text-align: center;
        overflow: hidden;
        box-shadow:0px 2px 4px 3px rgba(243,243,243,0.5);
        border-radius:@border-radius;
        margin-bottom:10px;
        text-align: left;
    }
    &-item:nth-child(even){
        // margin-left: 
    }
    &-img{
        display: block;
        width:100%;
        height: 160px;
        background: #eee;
    }
    &-hd{
        padding:10px 10px 0;
        font-size: 14px;
        color: #333;
        font-size: 14px;
        // margin-bottom: 5px;
    }
    &-bd{
        padding:10px 10px;
        display: block;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
    }
}
</style>



