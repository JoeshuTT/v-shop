<template>
  <div class="contaienr">
    <template v-if="loadingSpinner">
      <van-loading type="spinner" size="24px" class="ui-center">加载中...</van-loading>
    </template>
    <template v-else>
      <div class="list" v-if="list.length">
        <van-row gutter="10">
          <van-col span="12" v-for="item in list" :key="item.id">
        <div class="list-item" >
          <router-link :to="'/goods-detail?id='+item.goodsId">
            <div class="list-item-thumb"><img :src="item.pic" alt=""></div>
            <div class="list-item-title mb10">{{item.goodsName}}</div>
            <div class="list-item-actions"><van-button plain size="mini" round type="danger" >去购买</van-button></div>
          </router-link>
        </div>
        </van-col>
          </van-row>
      </div>
      <div class="no-data" v-else>
        <van-loading text-size="16" class="ui-center">暂无数据</van-loading>
      </div>
    </template>
  </div>
</template>

<script>
import { Loading } from 'vant'
import { storage } from '@/common/util'

export default {
  components: {
    [Loading.name]: Loading
  },
  data() {
    return {
      list: [],
      loadingSpinner: true
    }
  },
  created() {
    this.getFavList()
  },
  methods: {
    getFavList(nameLike, page = 1, pageSize = 50) {
      this.loadingSpinner = true
      this.$request.get('/shop/goods/fav/list', { token: storage.get('token'), nameLike, page, pageSize }).then(res => {
        this.loadingSpinner = false
        if (res.code !== 0) {
          return
        }
        this.list = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.no-data .van-loading__spinner {
  display: none;
}
.list{
  padding:15px;
}
.list-item {
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 2px 4px 2px rgba(228, 228, 228, 0.5);
  margin-bottom: 10px;
  padding:10px 0;
  &-title {
    padding:0 15px;
    font-size: 14px;
    line-height:24px;
    color: #333;
    // margin-bottom: 5px;
  }
  &-thumb {
    font-size: 12px;
    color: #999;
    height: 0;
    overflow: hidden;
    width:100%;
    padding-bottom:100%;
  }
  &-actions {
    padding:0 15px 5px;
    font-size: 12px;
    text-align: right;
  }
}
</style>

