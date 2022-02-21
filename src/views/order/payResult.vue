<template>
  <div class="container container-full">
    <div class="result">
      <div class="result-hd">
        <div class="result-icon">
          <template v-if="orderInfo.isPay">
            <IconPaySuccess class="result-svg-icon" />
          </template>
          <template v-else>
            <IconPayFail class="result-svg-icon" />
          </template>
        </div>
      </div>
      <div class="result-bd">
        <div class="result-title">{{ orderInfo.isPay ? '支付成功' : '支付失败' }}</div>
        <div class="result-title-sub">{{ orderInfo.isPay ? '感谢您的支持' : '再试试支付吧' }}</div>
      </div>
    </div>
    <div class="action">
      <van-button class="action-btn" @click="goOrder">查看订单</van-button>
      <van-button class="action-btn" plain @click="goHome">返回首页</van-button>
    </div>
  </div>
</template>

<script>
import API_ORDER from '@/apis/order';
import IconPaySuccess from '@/components/icons/IconPaySuccess.vue';
import IconPayFail from '@/components/icons/IconPayFail.vue';

export default {
  components: { IconPaySuccess, IconPayFail },
  data() {
    return {
      orderInfo: {},
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    goOrder() {
      this.$router.replace({
        path: '/order/list',
      });
    },
    goHome() {
      this.$router.replace({
        path: '/',
      });
    },
    getDetail() {
      API_ORDER.orderDetail({ orderNumber: this.$route.query.orderNumber }).then((res) => {
        this.orderInfo = res.data?.orderInfo ?? {};
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 10vh 20px 0;
  background: var(--white);
}

.result {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;

  &-bd {
    margin-left: 10px;
  }

  &-icon {
    color: var(--brand-color);
  }

  &-svg-icon {
    width: 41px;
    height: 47.5px;
    fill: currentColor;
    overflow: hidden;
  }

  &-title {
    text-align: center;
    height: 25px;
    font-size: 22px;
    font-weight: bold;
    color: var(--gray-color-8);
    line-height: 25px;
    font-weight: bold;
    margin-bottom: 4px;
    letter-spacing: 2px;
  }

  &-title-sub {
    font-size: 12px;
    color: var(--gray-color-6);
  }
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50vh;

  &-btn {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--brand-color);
    border: 1px solid var(--brand-color);
    border-radius: 20px;
    background: none;
  }

  &-btn:first-child {
    color: #fff;
    background: var(--brand-color);
    margin-bottom: 35px;
  }
}
</style>