<template>
  <div class="contaienr">
    <van-tabs v-model="active" class="mb10" @click="onClick">
      <van-tab :title="item.name" v-for="(item,index) in tabs" :key="index" />
    </van-tabs>
    <template v-if="loadingSpinner">
      <van-loading type="spinner" size="24px" class="ui-center">加载中...</van-loading>
    </template>
    <template v-else>
      <div class="list" v-if="list.length">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onListLoad">
          <div class="list-item" v-for="item in list" :key="item.id">
            <van-panel class="panel" :title="'订单编号：'+item.orderNumber" :status="item.statusStr">
              <template slot="default">
                <!-- <router-link :to="'/order-detail?id='+item.id">
                  <van-card v-for="(good,index) in goodsMap[item.id]"
                    :key="index"
                    :num="good.number"
                    :price="good.amount"
                    :desc="good.property"
                    :title="good.goodsName"
                    :thumb="good.pic" />
                </router-link> -->
                <router-link :to="'/order-detail?id='+item.id">
                  <van-card 
                    :num="goodsMap[item.id][0].number"
                    :price="goodsMap[item.id][0].amount"
                    :desc="goodsMap[item.id][0].property"
                    :title="goodsMap[item.id][0].goodsName"
                    :thumb="goodsMap[item.id][0].pic" />
                  <div class="card-load-more van-hairline--bottom" v-if="goodsMap[item.id].length>1">查看全部{{goodsMap[item.id].length}}件商品</div>
                </router-link>
                <div class="panel-money">共{{goodsMap[item.id].length}}件商品 合计：
                  <span class="fz12">￥</span>
                  <span class="ui-c-red fz16">{{item.amount}}</span>
                </div>
              </template>
              <div slot="footer" class="panel-actions" v-if="item.status === 0">
                <div class="panel-button" @click="onCancelOrder(item.id)">取消订单</div>
                <div class="panel-button panel-button-danger" @click="onPayOrder(item)">确认付款</div>
              </div>
              <div slot="footer" class="panel-actions" v-if="item.status === 2">
                <router-link :to="'/order-detail?id='+item.id">
                  <div class="panel-button panel-button-danger">确认收货</div>
                </router-link>
              </div>
              <div slot="footer" class="panel-actions" v-if="item.status === 3">
                <router-link :to="'/order-detail?id='+item.id">
                  <div class="panel-button panel-button-danger">评价</div>
                </router-link>
              </div>
            </van-panel>
          </div>
        </van-list>
      </div>
      <div class="no-data" v-else>
        <van-loading text-size="16" class="ui-center">暂无订单</van-loading>
      </div>
    </template>
  </div>
</template>

<script>
import { Tab, Tabs, Card, Panel, List, Loading } from 'vant'
import { storage, debounce,  } from '@/common/util'
import { pay_balance } from '@/common/pay'

export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Card.name]: Card,
    [Panel.name]: Panel,
    [List.name]: List,
    [Loading.name]: Loading,
  },
  data() {
    return {
      tabs: [
        { name: '全部', status: '' },
        { name: '待付款', status: '0' },
        { name: '待发货', status: '1' },
        { name: '待收货', status: '2' },
        { name: '待评价', status: '3' },
      ],
      active: 0,
      goodsMap: {},
      list: [],
      page: 1,
      pageSize: 50,
      loadingSpinner: true,
      loading: false,
      finished: true,
    }
  },
  created() {
    let status = this.$route.query.status === undefined ? '' : this.$route.query.status
    this.active = this.tabs.findIndex(item => item.status === status)
    this.getOrderList(status)
  },
  methods: {
    onListLoad() {
      // console.log(11)
    },
    onClick: debounce(function (index ) {
      this.getOrderList(this.tabs[index].status)
    }, 1000),
    getOrderList(status = '', page = this.page, pageSize = this.pageSize) {
      // 订单状态，-1 已关闭 0 待支付 1 已支付待发货 2 已发货待确认 3 确认收货待评价 4 已评价
      this.loadingSpinner = true
      const params = {
        token: storage.get('token'),
        status,
        page,
        pageSize,

      }
      this.$request.post('/order/list', params).then(res => {
        this.loadingSpinner = false
        if (res.code !== 0) {
          this.list = []
          this.goodsMap = []
          // this.$toast(res.msg)
          return;
        }
        this.list = res.data.orderList
        this.goodsMap = res.data.goodsMap
      })
    },
    onCancelOrder(id) {
      const orderId = id
      this.$dialog.confirm({
        // title: '提示',
        message: '订单还未付款,确定要取消吗?',
        cancelButtonText: '在考虑下',
        confirmButtonText: '取消订单'
      }).then(() => {
        // on confirm
        this.$toast.loading({
          mask: true,
          message: '加载中...',
          duration: 0,
        })
        this.$request.post('/order/close', { orderId, token: storage.get('token') }).then(res => {
          console.log(`/order/close：${JSON.stringify(res)}`)
          this.$toast({ message: '取消订单成功', duration: 1500 })
          this.getOrderList(this.tabs[this.active].status)
        })
      }).catch(() => {
        // on cancel
      });
    },
    onPayOrder(data) { 
      const orderId = data.id
      const amountReal = data.amountReal
      this.$toast.loading({
        mask: true,
        message: '支付提交中',
        duration:0,
      })
      pay_balance(orderId, storage.get('token')).then(res=>{
        if(res.code === 0){
          this.$toast.clear()
          this.$dialog.confirm({
              title: '支付成功',
              message: `实付￥${amountReal}`,
              cancelButtonText:'返回首页',
              confirmButtonText:'查看订单'
          }).then(() => {
            this.$router.replace({path:'/order-detail',query:{id:orderId}})
              // on confirm
          }).catch(() => { 
            // on cancel
              this.$router.replace({path:'/home'})
          })
        }else{
          this.$toast(res.msg)
        }
      })
      // this.$dialog.confirm({
      //   title: '提示',
      //   message: `没有接入支付,请联系管理员改单`,
      //   confirmButtonText: '我知道了'
      // }).then(() => {
      //   // on confirm
      // }).catch(() => {
      //   // on cancel
      // })
    }
  }
}
</script>

<style lang="less" scoped>
.list-item {
  margin-bottom: 10px;
}
.card-load-more{
  font-size: 14px;
  color:#f44;
  padding:5px;
  line-height:28px;
  text-align:center;
}
.panel {
  .van-panel__header-value {
    flex: none;
  }
  &-money {
    padding: 10px 15px;
    font-size: 14px;
    color: #333;
    text-align: right;
  }
  &-actions {
    text-align: right;
  }
  &-button {
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 20px;
    color: #666;
    border: 1px solid #b9b9b9;
  }
  &-button-danger {
    color: #f44;
    border: 1px solid #f44;
  }
  &-button::active {
    opacity: 0.8;
  }
}
.no-data .van-loading__spinner {
  display: none;
}
</style>


