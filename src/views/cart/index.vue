<template>
  <div class="container">
    <SpainList v-model="listLoading">
      <template v-if="list.length">
        <div class="goods">
          <div class="goods-header van-hairline--bottom">
            <div class="goods-header-hd">
              <video
                class="goods-header-cart"
                :src="cartVideoSrc"
                width="40"
                height="40"
                autoplay="autoplay"
                muted="muted"
                loop="loop"
                type="video/mp4"
              ></video>
              <span>购物车</span>
            </div>
            <div class="goods-header-bd" @click="onEditStatusChange">
              {{ editStatus === 1 ? '编辑' : '完成' }}
            </div>
          </div>
          <div class="list">
            <div v-for="(item, index) in list" :key="item.key" class="list-item">
              <div class="list-item-selected">
                <van-checkbox v-model="item.selected"></van-checkbox>
              </div>
              <van-image fit="contain" class="list-item-pic" :src="item.pic" />
              <div class="list-item-content">
                <div class="list-item-title">
                  <span v-if="item.status === 1" style="color: var(--gray-color-5)">【失效】</span>
                  {{ item.name }}
                </div>
                <div class="list-item-desc">
                  <div v-if="item.sku && item.sku.length" class="list-item-prop">{{ item.sku | propTitle }}</div>
                </div>
                <div class="list-item-bottom">
                  <div class="list-item-price">
                    <span class="list-item-price-symbol">¥</span>
                    <span class="list-item-price-integer">{{ item.price | decimalFormat }}</span>
                  </div>
                  <template v-if="item.status === 0">
                    <van-stepper
                      :value="item.number"
                      async-change
                      class="sku-num-stepper"
                      @change="onGoodChange($event, index)"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <van-empty v-else class="empty" :image="listEmptyImage">
        <template v-if="hasLogin">
          <div class="empty-title">购物车快饿瘪了 T.T</div>
          <div class="empty-txt">快给我挑点宝贝</div>
          <van-button class="empty-btn" round plain type="primary" @click="goHome">去逛逛</van-button>
        </template>
        <template v-else>
          <div class="empty-title">登录后才能看到您的购物车</div>
          <van-button class="empty-btn" type="primary" round @click="goLogin">去登录</van-button>
        </template>
      </van-empty>
    </SpainList>
    <!--结算栏 -->
    <div class="submit-bar-wrap">
      <div v-if="list.length" class="submit-bar">
        <van-checkbox v-model="selectedAll">全选</van-checkbox>
        <template v-if="editStatus === 2">
          <div class="submit-bar-hd"></div>
          <van-button class="submit-bar-button" round plain @click="onDelete">删除</van-button>
        </template>
        <template v-else>
          <div class="submit-bar-hd">
            <span class="submit-bar-total">合计：</span>
            <div class="submit-bar-price">
              <span class="submit-bar-price-symbol">¥</span>
              <span class="submit-bar-price-integer">{{ totalPrice | decimalFormat }}</span>
            </div>
          </div>
          <van-button class="submit-bar-button" round type="primary" @click="onSubmit"
            >去结算({{ totalGoodCount }})</van-button
          >
        </template>
      </div>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import NP from 'number-precision';
import API_CART from '@/apis/cart';
import Tabbar from '@/components/Tabbar';
import SpainList from '@/components/SpainList';
import usePage from '@/mixins/usePage';
import { decimalFormat } from '@/utils/format';
import { debounce } from '@/utils';

export default {
  components: { Tabbar, SpainList },
  filters: {
    decimalFormat,
    propTitle(list) {
      return list.map((v) => v.optionValueName).join(',');
    },
  },
  mixins: [usePage],
  data() {
    return {
      editStatus: 1, // 编辑, 取消

      list: [],
      listLoading: true,
      listEmptyText: '暂无数据',
      listEmptyImage: require('@/assets/images/empty/cart.png'),
      cartVideoSrc: require('@/assets/videos/shopping-cart.mp4'),
    };
  },
  computed: {
    selectedList() {
      return this.list.filter((v) => v.selected);
    },
    totalGoodCount() {
      return this.selectedList.reduce((acc, cur) => NP.plus(acc, cur.number), 0);
    },
    totalPrice() {
      return this.selectedList.reduce((acc, cur) => NP.plus(acc, NP.times(cur.price, cur.number)), 0);
    },
    selectedAll: {
      get() {
        return this.selectedList.length === this.list.length;
      },
      set(val) {
        this.list.forEach((v) => {
          v.selected = val;
        });
      },
    },
  },
  created() {
    if (this.hasLogin) {
      this.getList();
    } else {
      this.listLoading = false;
    }
  },
  methods: {
    ...mapActions({
      setTradeGoods: 'order/setTradeGoods',
    }),
    getList() {
      this.listLoading = true;

      API_CART.shoppingCartInfo()
        .then((res) => {
          this.list = res.data?.items ?? [];
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    onEditStatusChange() {
      this.editStatus = this.editStatus === 1 ? 2 : 1;
    },
    onGoodChange: debounce(function (number, index) {
      const { key } = this.list[index];
      this.cartNumberHandle(index, { key, number });
    }, 1000),
    onDelete() {
      if (!this.selectedList.length) {
        this.$toast({
          message: '您还没有选择商品哦',
          duration: 1500,
        });
        return;
      }

      const type = this.selectedList.length === this.list.length ? 'empty' : 'remove';
      const message = type === 'empty' ? `确定要清空购物车吗？` : `确定要删除这${this.selectedList.length}个商品吗？`;
      this.$dialog
        .confirm({
          message: message,
        })
        .then(() => {
          if (type === 'empty') {
            this.cartEmptyHandle();
          } else {
            this.cartRemoveHandle();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cartNumberHandle(index, { key, number }) {
      this.$toast.loading({
        forbidClick: true,
        message: '修改中...',
        duration: 0,
      });

      API_CART.shoppingCartModifyNumber({ number, key })
        .then((res) => {
          this.$toast.clear();
          this.list = res.data?.items ?? [];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cartEmptyHandle() {
      API_CART.shoppingCartEmpty()
        .then(() => {
          this.list = [];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cartRemoveHandle() {
      const keyStr = this.selectedList.map((v) => v.key).join(',');
      API_CART.shoppingCartRemove({ key: keyStr })
        .then((res) => {
          this.list = res.data?.items ?? [];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goHome() {
      this.$router.replace('/home');
    },
    goLogin() {
      this.$router.push({
        path: '/login',
        query: {
          redirect: this.$route.path,
        },
      });
    },
    onSubmit() {
      if (!this.selectedList.length) {
        this.$toast({
          message: '您还没有选择商品哦',
          duration: 1500,
        });
        return;
      }

      if (this.selectedList.some((v) => v.status === 1)) {
        this.$toast({
          message: '请删除掉失效商品',
          duration: 1500,
        });
        return;
      }

      this.setTradeGoods({
        origin: 'cart',
        list: this.selectedList,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.goods {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 12px 10px;
  border-radius: 8px;
  background-color: var(--white);

  &-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 15px;
    font-size: 14px;

    &.van-hairline--bottom::after {
      right: -40%;
      left: -40%;
    }

    &-hd,
    &-bd {
      flex: 1;
    }

    &-hd {
      display: flex;
      align-items: center;
    }

    &-bd {
      position: relative;
      overflow: hidden;
      color: #38f;
      text-align: right;
    }

    &-cart {
      margin-left: -10px;
      width: 40px;
      height: 40px;
    }
  }
}

.list {
  padding-top: 10px;

  &-item {
    position: relative;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    align-items: center;

    &-selected {
      margin-left: -10px;
      min-width: 40px;
      display: flex;
      justify-content: center;
    }

    &-pic {
      width: 90px;
      height: 90px;
      border-radius: 8px;
      margin-right: 10px;
      overflow: hidden;
    }

    &-content {
      min-width: 0;
      min-height: 90px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-title {
      font-size: 14px;
      line-height: 18px;
      color: var(--gray-color-8);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-desc {
      flex: 1;
      font-size: 12px;
      line-height: 20px;
      color: var(--gray-color-6);
    }

    &-price {
      color: var(--brand-color);
      &-symbol {
        font-size: 12px;
        margin-right: 2px;
      }

      &-integer {
        font-size: 18px;
        font-family: @font-family-price-integer;
      }
    }
  }
}

.submit-bar {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: calc(50px + constant(safe-area-inset-bottom));
  bottom: calc(50px + env(safe-area-inset-bottom));
  z-index: 100;
  width: 100%;
  padding: 0 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  font-size: 14px;

  &-wrap {
    height: calc(50px + constant(safe-area-inset-bottom));
    height: calc(50px + env(safe-area-inset-bottom));
  }

  &-hd {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    color: var(--gray-color-8);
  }

  &-price {
    color: var(--brand-color);
    font-weight: bold;

    &-symbol {
      font-size: 12px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 20px;
      font-family: @font-family-price-integer;
    }
  }

  &-button {
    width: 110px;
    height: 40px;
  }
}

.empty {
  text-align: center;

  &-title {
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--gray-color-8);
  }

  &-txt {
    font-size: 14px;
    color: var(--gray-color-6);
  }

  &-btn {
    box-sizing: border-box;
    width: 74px;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
    margin: 10px auto 0;
    border-radius: 16px;
  }

  ::v-deep .van-empty__bottom {
    // border: 1px solid var(--brand-color);
    // color: var(--brand-color);
    // background: transparent;
  }
}
</style>
