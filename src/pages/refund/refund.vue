<template>
  <div class="contaienr">
    <van-list class="list" v-model="loading" :finished="finished" :finished-text="finishedTxt" @load="onListLoad">
      <div class="list-item"  v-for="item in list" :key="item.id" >
        <van-panel class="panel" :title="'订单编号：'+item.orderNumber" :status="item.statusStr">
          <template slot="default">
            <router-link :to="'/order-detail?id='+item.id">
              <van-card
                :num="goodsMap[item.id][0].number"
                :price="goodsMap[item.id][0].amount"
                :desc="goodsMap[item.id][0].property"
                :title="goodsMap[item.id][0].name"
                :thumb="goodsMap[item.id][0].pic" />
              <div class="card-load-more van-hairline--bottom" v-if="goodsMap[item.id].length>1">查看全部{{goodsMap[item.id].length}}件商品</div>
            </router-link>
            <div class="panel-money">共{{goodsMap[item.id].length}}件商品 合计：
              <span class="fz12">￥</span>
              <span class="ui-c-red fz16">{{item.amount}}</span>
            </div>
          </template>
          <div slot="footer" class="panel-actions">
            <router-link :to="'/refund-apply?orderId='+item.id+'&amount='+item.amount" v-if="item.status < 2">
              <div class="panel-button panel-button-danger">退款</div>
            </router-link>
            <router-link :to="'/refund-apply?orderId='+item.id+'&amount='+item.amount" v-else>
              <div class="panel-button panel-button-danger">申请售后</div>
            </router-link>
          </div>
        </van-panel>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Card, Panel, List } from 'vant'
import { storage } from '@/common/util'

export default {
  components: {
    [Card.name]: Card,
    [Panel.name]: Panel,
    [List.name]: List
  },
  data() {
    return {
      goodsMap: {},
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      finishedTxt: '没有更多了'
    }
  },
  created() {

  },
  methods: {
    onListLoad() {
      this.getOrderList('', this.page++, this.pageSize)
    },
    getOrderList(status = '', page = this.page, pageSize = this.pageSize) {
      // 订单状态，-1 已关闭 0 待支付 1 已支付待发货 2 已发货待确认 3 确认收货待评价 4 已评价
      const params = {
        token: storage.get('token'),
        status,
        page,
        pageSize

      }
      this.$request.post('/order/list', params).then(res => {
        if (res.code === 404) {
          this.loading = false
          this.finished = true
          this.finishedTxt = page > 1 ? '暂无数据' : '没有更多了'
          return
        }
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }

        const list = res.data.orderList.filter(item => item.status > 0)
        list.forEach(item => { this.goodsMap[item.id] = res.data.goodsMap[item.id] })
        this.list = this.list.concat(list)

        this.loading = false
        this.finishedTxt = '没有更多了'
      })
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

