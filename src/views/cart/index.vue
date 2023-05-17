<script lang="ts">
export default {
  name: 'Cart',
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import { showConfirmDialog, showToast, showLoadingToast, closeToast } from 'vant';
import NP from 'number-precision';
import { useDebounceFn } from '@vueuse/core';
import API_CART from '@/apis/cart';
import { decimalFormat } from '@/utils/format';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/cart.png';
import ICON_SHOPPING_CART from '@/assets/videos/shopping-cart.mp4';

import { useOrderStore } from '@/store/modules/order';
import { usePage } from '@/hooks/shared/usePage';

onMounted(() => {
  if (unref(hasLogin)) {
    getList();
  } else {
    listLoading.value = false;
  }
});

const orderStore = useOrderStore();
const { hasLogin, goHome, goLogin } = usePage();

const editStatus = ref(1); // 编辑, 取消
function onEditStatusChange() {
  editStatus.value = unref(editStatus) === 1 ? 2 : 1;
}

const list = ref<Recordable[]>([]);
const listLoading = ref(true);
// const listEmptyText = ref('暂无数据');
const listEmptyImage = IMAGE_LIST_EMPTY;
const cartVideoSrc = ICON_SHOPPING_CART;

function propTitle(list: Recordable[]) {
  return list.map((v) => v.optionValueName).join(',');
}

const selectedList = computed(() => {
  return unref(list).filter((v) => v.selected);
});

const totalGoodCount = computed(() => {
  return unref(selectedList).reduce((acc, cur) => NP.plus(acc, cur.number), 0);
});

const totalPrice = computed(() => {
  return unref(selectedList).reduce((acc, cur) => NP.plus(acc, NP.times(cur.price, cur.number)), 0);
});

const selectedAll = computed({
  get() {
    return unref(selectedList).length === unref(list).length;
  },
  set(val) {
    unref(list).forEach((v) => {
      v.selected = val;
    });
  },
});

function getList() {
  listLoading.value = true;

  API_CART.shoppingCartInfo()
    .then((res) => {
      list.value = res.data?.items ?? [];
    })
    .finally(() => {
      listLoading.value = false;
    });
}

const onGoodChange = useDebounceFn((number, index) => {
  const { key } = unref(list)[index];
  cartNumberHandle(index, { key, number });
}, 1000);

function onDelete() {
  if (!unref(selectedList).length) {
    showToast({
      message: '您还没有选择商品哦',
      duration: 1500,
    });
    return;
  }

  const type = unref(selectedList).length === unref(list).length ? 'empty' : 'remove';
  const message = type === 'empty' ? `确定要清空购物车吗？` : `确定要删除这${unref(selectedList).length}个商品吗？`;

  showConfirmDialog({
    message: message,
  })
    .then(() => {
      if (type === 'empty') {
        cartEmptyHandle();
      } else {
        cartRemoveHandle();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function cartNumberHandle(_index: number, { key, number }) {
  showLoadingToast({
    forbidClick: true,
    message: '修改中...',
    duration: 0,
  });

  API_CART.shoppingCartModifyNumber({ number, key })
    .then((res) => {
      closeToast();
      list.value = res.data?.items ?? [];
    })
    .catch((err) => {
      console.log(err);
    });
}

function cartEmptyHandle() {
  API_CART.shoppingCartEmpty()
    .then(() => {
      list.value = [];
    })
    .catch((err) => {
      console.log(err);
    });
}

function cartRemoveHandle() {
  const keyStr = unref(selectedList)
    .map((v) => v.key)
    .join(',');
  API_CART.shoppingCartRemove({ key: keyStr })
    .then((res) => {
      list.value = res.data?.items ?? [];
    })
    .catch((err) => {
      console.log(err);
    });
}

function onSubmit() {
  if (!unref(selectedList).length) {
    showToast({
      message: '您还没有选择商品哦',
      duration: 1500,
    });
    return;
  }

  if (unref(selectedList).some((v) => v.status === 1)) {
    showToast({
      message: '请删除掉失效商品',
      duration: 1500,
    });
    return;
  }
  orderStore.setTradeGoods({
    origin: 'cart',
    list: unref(selectedList),
  });
}
</script>

<template>
  <div class="container">
    <SpainList v-model:loading="listLoading">
      <template v-if="list.length">
        <div class="goods">
          <div class="goods-header van-hairline--bottom">
            <div class="goods-header-hd">
              <video
                class="goods-header-cart"
                :src="cartVideoSrc"
                width="40"
                height="40"
                autoplay
                muted
                loop
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
                  <span v-if="item.status === 1" style="color: var(--color-text-4)">【失效】</span>
                  {{ item.name }}
                </div>
                <div class="list-item-desc">
                  <div v-if="item.sku && item.sku.length" class="list-item-prop">{{ propTitle(item.sku) }}</div>
                </div>
                <div class="list-item-bottom">
                  <div class="list-item-price">
                    <span class="list-item-price-symbol">¥</span>
                    <span class="list-item-price-integer">{{ decimalFormat(item.price) }}</span>
                  </div>
                  <template v-if="item.status === 0">
                    <van-stepper
                      :model-value="item.number"
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
              <span class="submit-bar-price-integer">{{ decimalFormat(totalPrice) }}</span>
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

<style lang="less" scoped>
.goods {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 12px 10px;
  border-radius: 8px;
  background-color: var(--color-bg-2);

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
      color: var(--color-text-1);
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
      color: var(--color-text-3);
    }

    &-price {
      color: var(--color-primary);
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
  bottom: calc(50px + var(--safe-area-height-bottom));
  z-index: 100;
  width: 100%;
  padding: 0 16px;
  background-color: var(--color-bg-2);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  font-size: 14px;

  &-wrap {
    height: calc(50px + var(--safe-area-height-bottom));
  }

  &-hd {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    color: var(--color-text-1);
  }

  &-price {
    color: var(--color-primary);
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
    color: var(--color-text-1);
  }

  &-txt {
    font-size: 14px;
    color: var(--color-text-3);
  }

  &-btn {
    box-sizing: border-box;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
    margin: 10px auto 0;
    border-radius: 16px;
  }
}

.dark {
  .goods-header-cart {
    display: none;
  }
}
</style>
