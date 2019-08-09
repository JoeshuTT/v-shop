<template>
  <div class="contaienr">
    <template v-if="loadingSpinner">
      <van-loading type="spinner" size="24px" class="ui-center">加载中...</van-loading>
    </template>
    <template v-else>
      <div class="list" v-if="list.length">
        <div class="list-item mb10" v-for="item in list" :key="item.id">
          <div class="list-item-hd">
            <div class="list-item-title">{{item.typeStr}}</div>
            <div class="list-item-txt">{{item.dateAdd}}</div>
          </div>
          <div class="list-item-bd" :class="item.behavior ? 'ui-c-red': 'ui-c-green'">{{item.behavior? '-' : '+' }}{{item.amount}}</div>
        </div>
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
    this.getCashLog()
  },
  methods: {
    getCashLog(page = 1, pageSize = 50) {
      this.loadingSpinner = true
      this.$request.get('/user/cashLog', { token: storage.get('token'), page, pageSize }).then(res => {
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
.list {
  padding: 15px;
}
.list-item {
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 15px;
  background: #fff;
  &-hd {
    flex: 1;
  }
  &-bd {
    // flex:1;
  }
  &-title {
    padding: 0 15px;
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
  }
  &-txt {
    font-size: 14px;
    color: #999;
  }
  &-actions {
    padding: 0 15px 5px;
    font-size: 12px;
    text-align: right;
  }
}
</style>

