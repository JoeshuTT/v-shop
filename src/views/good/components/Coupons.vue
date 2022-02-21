<template>
  <div class="coupons">
    <van-cell v-if="list.length" class="mb10" title="领券" is-link @click="onOpen" />
    <!-- 弹层 -->
    <van-popup v-model="show" round closeable position="bottom" class="coupons-popup">
      <div class="coupons-header van-hairline--bottom">优惠券</div>
      <div class="coupons-body">
        <div class="coupon-list">
          <div v-for="(item, index) in list" :key="item.id" class="coupon-list-item">
            <div class="coupon-list-item-hd">
              <div class="coupon-list-item-money"><span class="fz12">¥</span>{{ item.moneyMin }}</div>
              <div class="coupon-list-item-moneyHreshold">满{{ item.moneyHreshold }}元可用</div>
            </div>
            <div class="coupon-list-item-bd">
              <div class="coupon-list-item-name">{{ item.moneyMin }}元券</div>
              <div v-if="item.dateEndType === 0" class="coupon-list-item-dateEndDays">
                领取后 {{ item.dateEnd.slice(0, 10) }} 到期
              </div>
              <div v-if="item.dateEndType === 1" class="coupon-list-item-dateEndDays">
                领取后 {{ item.dateEndDays }} 天后到期
              </div>
            </div>
            <div class="coupon-list-item-btn" @click="onItemClicked(index)">立即领取</div>
          </div>
        </div>
      </div>
      <div class="coupons-footer" @click="onClose">
        <van-button type="primary" round block @click="onClose">完成</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import API_DISCOUNTS from '@/apis/discounts';

export default {
  name: 'Coupons',
  props: {
    title: String,
    list: Array,
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    onOpen() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
    onItemClicked(index) {
      const coupon = this.list[index];

      if (coupon.pwd) {
        this.$toast({ message: '本券需要使用口令才能领取', duration: 1500 });
        return;
      }

      this.$toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      const params = {
        id: coupon.id,
      };

      API_DISCOUNTS.discountsFetch(params)
        .then((res) => {
          if (res.code === 0) {
            this.$toast({ message: '恭喜,抢到了~', duration: 1500 });
          }
        })
        .catch((error) => {
          // this.$toast({ message: '很遗憾,没抢到~', duration: 1500 });
          console.error(error);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.coupons {
  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    color: var(--gray-color-8);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    // padding: 10px 15px;
  }

  &-footer {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}

.coupon-list {
  padding: 10px 15px;
  max-height: 70vh;
  overflow-y: auto;
  &-header {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 0;
    left: 0;
    font-size: 14px;
    color: #333;
    padding: 10px 0;
    text-align: center;
  }
}
.coupon-list-item {
  box-sizing: border-box;
  height: 76px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #ffeeee;
  color: #ff4b52;
  margin-bottom: 10px;
  border-radius: 10px;

  &-hd {
    width: 100px;
    text-align: center;
    border-right: 1px slategrey #eee;
  }
  &-money {
    font-size: 24px;
    font-weight: bold;
    // margin-bottom:10px;
  }
  &-moneyHreshold {
    font-size: 12px;
  }
  &-bd {
    flex: 1;
  }
  &-name {
    font-size: 14px;
    padding: 5px 0;
  }
  &-dateEndDays {
    font-size: 12px;
    color: #d7a0a5;
  }
  &-btn {
    margin-right: 25px;
    display: inline-block;
    padding: 0.2em 0.5em;
    color: #fff;
    background: #ff4444;
    font-size: 10px;
    line-height: normal;
    border-radius: 0.8em;
  }
  &-btn-clicked {
    color: #ff4444;
    background: #ffffff;
    border: 1px solid #ff4444;
    pointer-events: none;
  }
}

.mb10 {
  margin-bottom: 10px;
}

.fz12 {
  font-size: 12px;
}
</style>