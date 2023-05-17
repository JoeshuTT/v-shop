<script lang="ts">
export default {
  name: 'Mine',
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import API_USER from '@/apis/user';
import API_DISCOUNTS from '@/apis/discounts';
import API_ORDER from '@/apis/order';
import MineSvgWaveBg from '@/components/MineSvgWaveBg/index.vue';
import { countPair } from '@/utils/format';
import { assets } from '@/constants';
import ICON_ART from '@/assets/images/icon_art.png';
import ICON_DEVICE from '@/assets/images/icon_device.png';
import { showClientInfoPopup } from '@/components/AppClientInfoPopup';
import { useUserStore } from '@/store/modules/user';
import { usePage } from '@/hooks/shared/usePage';

onMounted(() => {
  if (unref(hasLogin)) {
    userStore.getUserDetail();
    getCounts();
  }
});

const userStore = useUserStore();
const { hasLogin, goLogin, goPage } = usePage();

// 统计
const growth = ref(0); // 成长值
const balance = ref(undefined);
const score = ref(undefined);
const couponCanUse = ref(undefined);

// 我的订单
const orderList = ref<Recordable[]>([
  {
    value: '',
    label: '待付款',
    icon: 'pending-payment',
    path: '/order/list?status=0',
    count: undefined,
    countKey: 'count_id_no_pay',
  },
  {
    value: '',
    label: '待发货',
    icon: 'tosend',
    path: '/order/list?status=1',
    count: undefined,
    countKey: 'count_id_no_transfer',
  },
  {
    value: '',
    label: '待收货',
    icon: 'logistics',
    path: '/order/list?status=2',
    count: undefined,
    countKey: 'count_id_no_confirm',
  },
  {
    value: '',
    label: '评价',
    icon: 'comment-o',
    path: '/order/list?status=3',
    count: undefined,
    countKey: 'count_id_no_reputation',
  },
  {
    value: '',
    label: '退款/售后',
    icon: 'after-sale',
    path: '/refund',
    count: undefined,
  },
]);

// 常用功能
const toolList = ref<Recordable[]>([
  { icon: 'balance-o', title: '我的钱包', path: '/wallet' },
  { icon: 'point-gift-o', title: '积分兑换', path: '/integral/exchange' },
  { icon: 'coupon-o', title: '优惠券', path: '/coupon' },
  { icon: 'location-o', title: '收货地址', path: '/address' },
  { icon: 'setting-o', title: '设置', path: '/setting' },
  { icon: ICON_ART, title: '主题', path: '/theme' },
  { icon: ICON_DEVICE, title: '我的设备', value: 'device' },
]);

function onToolClicked(item) {
  if (item.path) {
    goPage(item.path);
    return;
  }

  if (item.value === 'device') {
    showClientInfoPopup();
  }
}
const userInfo = computed(() => userStore.getUserInfo);
const userLevel = computed(() => userStore.getUserLevel);

function onEasterEgg() {
  const el = document.querySelector('.header-avatar') as HTMLElement;
  el.classList.toggle('active');
}

function getCounts() {
  API_USER.userAmount().then((res) => {
    balance.value = res.data?.balance ?? 0;
    growth.value = res.data?.growth ?? 0;
    score.value = res.data?.score ?? 0;
  });

  API_ORDER.orderStatistics().then((res) => {
    const orderCount = res.data;

    orderList.value.forEach((item) => {
      orderCount[item.countKey] && (item.count = orderCount[item.countKey]);
    });
  });

  API_DISCOUNTS.discountsStatistics().then((res) => {
    couponCanUse.value = res.data?.canUse ?? 0;
  });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div v-if="hasLogin" class="header-inner" @click="goPage('/profile')">
        <div class="header-tag">个人资料</div>
        <van-image class="header-avatar" :src="userInfo.avatarUrl || assets.avatar" alt="" @click.stop="onEasterEgg" />
        <div class="header-info">
          <div class="header-nick van-ellipsis mb10">
            {{ userInfo.nick || `还没有昵称` }}
          </div>
          <div class="header-sub">
            <span class="header-sub-item">ID {{ userInfo.id }}</span>
            <span class="header-sub-item-separate">|</span>
            <span class="header-sub-item">成长值 {{ growth }}</span>
            <span class="header-sub-item-separate">|</span>
            <!-- 会员等级 -->
            <span v-if="userLevel.id" class="header-sub-item"> 段位 {{ userLevel.name }} </span>
          </div>
        </div>
      </div>
      <div v-else class="header-inner" @click="goLogin">
        <van-image class="header-avatar" :src="assets.avatar" alt="" @click.stop="onEasterEgg" />
        <div class="header-info">
          <div class="header-nick">登录/注册</div>
        </div>
      </div>
      <div class="header-bg">
        <div class="header-bg-wave">
          <MineSvgWaveBg />
        </div>
      </div>
    </div>
    <div class="main">
      <div class="group"></div>
      <!-- 我的钱包 -->
      <div class="group">
        <div class="count-list">
          <div class="count-list-item" @click="goPage('/integral')">
            <div class="count-list-item-value">{{ countPair(score, 0) }}</div>
            <div class="count-list-item-label">积分</div>
          </div>
          <div class="count-list-item" @click="goPage('/coupon')">
            <div class="count-list-item-value">{{ countPair(couponCanUse, 0) }}</div>
            <div class="count-list-item-label">优惠券</div>
          </div>
          <div class="count-list-item" @click="goPage('/wallet')">
            <div class="count-list-item-value">{{ countPair(balance) }}</div>
            <div class="count-list-item-label">余额</div>
          </div>
        </div>
      </div>
      <!-- 订单 -->
      <div class="group">
        <div class="group-header van-hairline--bottom" @click="goPage('/order/list')">
          <div class="group-header-hd">我的订单</div>
          <div class="group-header-bd">
            <span class="group-header-txt">查看全部订单</span>
            <van-icon class="group-header-arrow" name="arrow" />
          </div>
        </div>
        <div class="order-list">
          <div v-for="(item, index) in orderList" :key="index" class="order-list-item" @click="goPage(item.path)">
            <van-icon class="order-list-item-icon" :name="item.icon" :badge="item.count" />
            <div class="order-list-item-title">{{ item.label }}</div>
          </div>
        </div>
      </div>
      <!-- 常用功能 -->
      <div class="group">
        <div class="group-header van-hairline--bottom">
          <div class="group-header-hd">常用功能</div>
        </div>
        <div class="tool-list">
          <div v-for="(item, index) in toolList" :key="index" class="tool-list-item" @click="onToolClicked(item)">
            <van-icon class="tool-list-item-icon" :name="item.icon" :badge="item.count" />
            <div class="tool-list-item-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 版权 -->
    <Copyright />
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.style-box() {
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-bg-2);
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 180px;
  color: #fff;
  background-color: var(--color-primary);
  overflow: hidden;

  &-bg {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    &-wave {
      position: absolute;
      left: 0;
      bottom: -20px;
      width: 100%;
    }
  }

  &-inner {
    box-sizing: border-box;
    position: absolute;
    top: 30px;
    width: 100%;
    padding: 0 15px;
    display: flex;
    align-items: center;
    z-index: 20;
  }

  &-tag {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    width: auto;
    padding: 2px 8px;
    color: #fff;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px 0 0 10px;
    z-index: 20;

    &-icon {
      margin-right: 5px;
    }
  }

  &-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;

    &.active {
      transform: rotate(666turn);
      transition-delay: 1s;
      transition-property: all;
      transition-duration: 60s;
      transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
    }
  }

  &-nick {
    font-size: 20px;
    max-width: 200px;
    height: 30px;
    line-height: 30px;
  }

  &-sub {
    font-size: 12px;
    line-height: 24px;
    color: #fff;
    display: flex;
    align-items: center;

    &-item {
      display: flex;
      align-items: center;

      &-separate {
        display: inline-flex;
        margin: 0 5px 0 5px;
      }

      &-icon {
        margin-right: 5px;
      }
    }
  }
}

// .main {
// padding:0 20px;
// margin-top: -50px;
// }

.mb10 {
  margin-bottom: 10px;
}

.group {
  .style-box();
  margin: 0 15px 15px 15px;
  &-inner {
    padding: 10px 0;
  }
}

.group {
  &-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 15px;

    &-hd {
      color: var(--color-text-1);
      text-align: left;
      font-size: 14px;
      font-weight: bold;
    }

    &-bd {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
      color: var(--color-text-3);
    }

    &-arrow {
      margin-left: 2px;
      font-size: 14px;
    }
  }
}

.order {
  &-list {
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
    align-items: center;

    &-item {
      box-sizing: border-box;
      width: 20%;
      text-align: center;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }

      &-title {
        color: var(--color-text-1);
        font-size: 12px;
      }
    }
  }
}

.tool {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      box-sizing: border-box;
      width: 25%;
      text-align: center;
      padding: 10px 0;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }

      &-title {
        color: var(--color-text-1);
        font-size: 12px;
      }
    }
  }
}

.balance {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      box-sizing: border-box;
      width: 25%;
      text-align: center;
      padding: 10px 0;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }

      &-title {
        color: var(--color-text-2);
        font-size: 14px;
      }
    }
  }
}

.count {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    &-item {
      box-sizing: border-box;
      flex: 1;
      padding: 10px 0;
      text-align: center;

      &-value {
        font-size: 16px;
        font-weight: bold;
        color: #141414;
        margin-bottom: 10px;
      }

      &-label {
        font-size: 12px;
        color: var(--color-text-2);
      }
    }
  }
}

.dark {
  .count-list-item-value {
    color: var(--van-text-color);
  }

  .header {
    background-color: var(--color-bg-2);
  }
  .header-tag {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
