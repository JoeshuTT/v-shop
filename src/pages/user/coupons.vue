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
        <div class="list-item" v-for="item in list" :key="item.id">
          <div class="list-item-hd">
            <div class="list-item-hd-money">￥<span class="fz24">{{item.money}}</span></div>
            <div class="list-item-hd-moneyHreshold">满{{item.moneyHreshold}}元可用</div>
          </div>
          <div class="list-item-bd">
            <div class="list-item-bd-inner">
              <div class="list-item-bd-title">{{item.name}}</div>
              <div class="list-item-bd-txt">{{item.dateStart | formatDate}} - {{item.dateEnd | formatDate}}</div>
            </div>
            <div class="list-item-bd-actions">
              <van-button plain round size="small" :type="active?'default':'danger'" :disabled="!!active" @click="onCouponClicked">{{tabs[active].buttonTxt}}</van-button>
            </div>
          </div>
        </div>
      </div>
      <div class="no-data" v-else>
        <van-loading text-size="16" class="ui-center">暂无数据</van-loading>
      </div>
    </template>
  </div>
</template>

<script>
import { Tab, Tabs, Loading } from 'vant'
import { storage, debounce } from '@/common/util'

export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Loading.name]: Loading
  },
  data() {
    return {
      tabs: [
        { name: '未使用', status: '0', buttonTxt: '立即使用' },
        { name: '已使用', status: '3', buttonTxt: '已使用' },
        { name: '已过期', status: '2', buttonTxt: '已过期' }
      ],
      active: 0,
      list: [],
      loadingSpinner: true
    }
  },
  filters: {
    formatDate(value) {
      return value.slice(0, 10).replace(/-/g, '.')
    }
  },
  created() {
    this.getMyDiscounts(this.tabs[this.active].status)
  },
  methods: {
    onClick: debounce(function(index) {
      this.getMyDiscounts(this.tabs[index].status)
    }, 300),
    onCouponClicked() {
      this.$router.push({ path: '/home' })
    },
    getMyDiscounts(status) {
      this.loadingSpinner = true
      this.$request.get('/discounts/my', { token: storage.get('token'), status }).then(res => {
        this.loadingSpinner = false
        if (res.code !== 0) {
          // this.$toast(res.msg)
          this.list = []
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

.list-item {
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  margin-left: 15px;
  margin-right: 15px;
  background: #fff;
  box-shadow: 0px 2px 4px 2px rgba(228, 228, 228, 0.5);
  &-hd {
    box-sizing: border-box;
    width: 100px;
    text-align: center;
    height: 100%;
    padding: 20px 0;
    background: linear-gradient(
      309deg,
      rgba(255, 112, 61, 1) 0%,
      rgba(255, 70, 57, 1) 100%
    );
    font-size: 14px;
    color: #fff;
    &-money {
      font-weight: bold;
      margin-bottom: 5px;
    }
  }
  &-bd {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0;
    &-title {
      font-size: 16px;
      color: #333;
      margin-bottom: 5px;
    }
    &-txt {
      font-size: 12px;
      color: #999;
    }
    &-actions {
      font-size: 12px;
    }
  }
}
</style>

