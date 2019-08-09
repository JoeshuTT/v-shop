<template>
  <div class="container pd100">
    <div class="goods-box"
      v-if="goods.length">
      <van-cell title="v-shop"
        icon="shop-o">
        <div slot="default"
          class="status-tip"
          @click="onStatusClicked">{{statusTip}}</div>
      </van-cell>
      <van-checkbox-group class="list"
        v-model="checkedGoods">
        <van-checkbox class="list-item"
          v-for="(item, index) in goods"
          :key="index"
          :name="item.id"
          checked-color="#ff4444"
          label-disabled>
          <van-card :title="item.name"
            :desc="item.propTitle"
            :price="item.price"
            :thumb="item.pic">
            <div slot="num">
              <van-stepper v-model="item.selectedNum"
                @change="onNumberChange" />
            </div>
          </van-card>

        </van-checkbox>
      </van-checkbox-group>
      <!-- 结算栏 -->
      <van-submit-bar v-if="statusTip === '管理'"
        class="submit-bar"
        :price="totalPrice | formatPoint"
        :button-text="submitBarText"
        :disabled="!checkedGoods.length"
        @submit="onSubmit">
        <van-checkbox v-model="checkedAll">全选</van-checkbox>
      </van-submit-bar>
      <!-- 删除栏 -->
      <van-submit-bar v-else
        class="delete-bar"
        button-text="删除"
        :disabled="!checkedGoods.length"
        @submit="onDeleteClicked">
        <van-checkbox v-model="checkedAll">全选</van-checkbox>
      </van-submit-bar>
    </div>
    <div class="no-data"
      v-else>
      <img src="../../assets/no-cart.png"
        alt="">
      <div class="no-data-title">购物车快饿瘪了 T.T</div>
      <div class="no-data-txt">快给我挑点宝贝</div>
      <van-button class="no-data-btn"
        plain
        type="danger"
        @click="handleHomePage">去逛逛</van-button>
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
import { Tabbar, TabbarItem, Checkbox, CheckboxGroup, Card, Stepper, SubmitBar } from 'vant'
import util from '@/common/util'
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Card.name]: Card,
    [Stepper.name]: Stepper,
    [SubmitBar.name]: SubmitBar
  },
  data() {
    return {
      active: 0,
      statusTip: '管理', // 管理,完成
      checkedAll: false,
      checkedGoods: [],
      goods: []

    }
  },
  computed: {
    submitBarText() {
      const count = this.checkedGoods.length
      return '结算' + (count ? `(${count})` : '')
    },
    totalPrice() {
      const price = this.goods.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price * item.selectedNum : 0), 0)
      return parseFloat(price.toFixed(2))
    }
  },
  filters: {
    formatPoint(val) {
      return parseFloat((val * 100).toFixed(2))
    }
  },
  watch: {
    checkedAll() {
      this.checkedAll ? this.checkedGoods = this.goods.map(item => item.id) : this.checkedGoods = []
    },
    checkedGoods() {
      if (this.checkedGoods.length === this.goods.length) {
        this.checkedAll = true
      }
    }
  },
  created() {
    this.goods = util.storage.get('cartInfo') || []
  },
  methods: {
    handleHomePage() {
      this.$router.replace({ path: '/home' })
    },
    onStatusClicked() {
      this.statusTip === '管理' ? this.statusTip = '完成' : this.statusTip = '管理'
    },
    onDeleteClicked() {
      this.$dialog.confirm({
        message: `确定要删除这${this.checkedGoods.length}个商品吗?`
      }).then(() => {
        this.goods = this.goods.filter(item => !(this.checkedGoods.indexOf(item.id) !== -1))
        this.checkedGoods = []
        util.storage.set('cartInfo', this.goods)
      })
    },
    onNumberChange(val) {
      console.log('onNumberChange', val)
      util.storage.set('cartInfo', this.goods)
    },
    onSubmit() {
      util.storage.set('cartInfo', this.goods)
      this.$router.push({ path: '/order-submit', query: { type: 'cart', checkedGoods: this.checkedGoods }})
    }
  }
}
</script>
<style lang="less" scoped>
.status-tip {
  position: relative;
  overflow: hidden;
  color: #38f;
  text-align: right;
  vertical-align: middle;
}
.list {
  padding: 10px 0;
  background-color: #fff;
  &-item {
    position: relative;
    .van-card {
      background-color: #fff;
    }
    /deep/ .van-checkbox__label {
      width: 100%;
      height: auto; // temp
      padding: 0 10px 0 15px;
      box-sizing: border-box;
    }
    /deep/ .van-checkbox__icon {
      top: 50%;
      left: 10px;
      z-index: 1;
      position: absolute;
      margin-top: -10px;
      font-size: 16px;
    }
    .van-card__price {
      color: #f44;
    }
    .van-card__bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
  }
}
.delete-bar {
  .van-submit-bar__bar {
    margin-left: 10px;
    justify-content: space-between;
    align-items: center;
  }
  /deep/.van-checkbox__icon--checked .van-icon {
    background-color: #f44;
    border-color: #f44;
  }
}
.submit-bar {
  bottom: 50px;
  .van-checkbox {
    margin-left: 10px;
  }
  /deep/.van-checkbox__icon--checked .van-icon {
    background-color: #f44;
    border-color: #f44;
  }
}
.no-data {
  padding-top: 150px;
  text-align: center;
  > img {
    display: inline-block;
    width: 290px;
    margin-bottom: 20px;
  }
  &-title {
    font-size: 16px;
    color: #666;
    font-weight: 400;
    margin-bottom: 10px;
  }
  &-txt {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
  }
  &-btn {
    padding: 0 20px;
    height: 34px;
    line-height: 32px;
  }
}
</style>

