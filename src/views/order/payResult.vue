<template>
  <div class="container container-full">
    <div class="result">
      <div class="result-hd">
        <div class="result-icon">
          <template v-if="orderInfo.isPay">
            <svg class="svg-icon" width="82px" height="95px" viewBox="0 0 82 95">
              <title>成功图标</title>
              <defs>
                <filter
                  id="filter-1"
                  x="-6.8%"
                  y="-50.0%"
                  width="113.5%"
                  height="200.0%"
                  filterUnits="objectBoundingBox"
                >
                  <feGaussianBlur stdDeviation="1.1" in="SourceGraphic"></feGaussianBlur>
                </filter>
              </defs>
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-220.000000, -302.000000)">
                  <g transform="translate(220.000000, 305.000000)">
                    <g>
                      <g transform="translate(0.000000, 9.611390)" fill-rule="nonzero">
                        <rect fill="#000000" opacity="0" x="0" y="0" width="59.4" height="59.4"></rect>
                        <path
                          d="M29.7,0 C13.365,0 0,13.365 0,29.7 C0,46.035 13.365,59.4 29.7,59.4 C46.035,59.4 59.4,46.035 59.4,29.7 C59.4,13.365 46.035,0 29.7,0 Z M48.2625,20.79 L27.10125,42.69375 C26.73,43.065 26.35875,43.065 25.61625,43.065 C25.245,43.065 24.5025,43.065 24.13125,42.69375 L11.1375,28.58625 C10.76625,27.84375 10.76625,26.73 11.1375,25.9875 L12.6225,24.5025 C13.365,23.76 14.47875,23.76 15.22125,24.5025 L24.5025,31.9275 C24.87375,32.29875 25.245,32.29875 25.61625,32.29875 C25.9875,32.29875 26.73,31.9275 27.10125,31.55625 L44.17875,16.335 C44.92125,15.5925 46.035,15.5925 46.7775,16.335 L48.2625,18.19125 C48.63375,18.93375 48.63375,20.0475 48.2625,20.79 Z"
                          fill="currentColor"
                        ></path>
                      </g>
                      <path
                        d="M57.0771903,6.10988852 L60.7483817,0"
                        stroke="currentColor"
                        stroke-width="4.752"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M65.6869203,16.0882504 L71.9212096,12.6325274"
                        stroke="currentColor"
                        stroke-width="4.752"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M71.0080006,28.0167178 L78.1316584,27.7679541"
                        stroke="currentColor"
                        stroke-width="4.752"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                    <ellipse fill="#D8D8D8" filter="url(#filter-1)" cx="30.25" cy="85.8" rx="24.42" ry="3.3"></ellipse>
                  </g>
                </g>
              </g>
            </svg>
          </template>
          <template v-else>
            <svg class="svg-icon" width="82px" height="95px" viewBox="0 0 82 95">
              <title>失败图标</title>
              <defs>
                <filter
                  id="filter-1"
                  x="-6.8%"
                  y="-50.0%"
                  width="113.5%"
                  height="200.0%"
                  filterUnits="objectBoundingBox"
                >
                  <feGaussianBlur stdDeviation="1.1" in="SourceGraphic"></feGaussianBlur>
                </filter>
              </defs>
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-220.000000, -302.000000)">
                  <g transform="translate(215.000000, 305.000000)">
                    <g>
                      <g
                        transform="translate(62.700000, 0.000000)"
                        stroke="#E94949"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4.752"
                      >
                        <path d="M-1.4301893e-12,6.10988852 L3.6711914,4.4408921e-15"></path>
                        <path d="M8.60972999,16.0882504 L19.1051665,10.2705349"></path>
                        <path d="M13.9308103,28.0167178 L21.0544681,27.7679541"></path>
                      </g>
                      <g transform="translate(0.000000, 3.300000)" fill-rule="nonzero">
                        <rect fill="#000000" opacity="0" x="0" y="0" width="59.4" height="59.4"></rect>
                        <path
                          d="M47.6276668,24.0291665 C46.5305931,22.9363324 44.7563776,22.9363324 43.6593039,24.0291665 L35.4258969,32.2625736 L27.5210296,24.3577063 C26.4565374,23.2932141 24.7306546,23.2932141 23.6661624,24.3577063 C22.6016702,25.4221985 22.6016702,27.1480814 23.6661624,28.2125736 L31.5710296,36.1174409 L23.3376226,44.350848 C22.314582,45.4582307 22.3487854,47.1759174 23.415099,48.241696 C24.4814125,49.3074745 26.1991162,49.3408159 27.3059854,48.3172197 L35.5393925,40.0858037 L43.4900562,48.030494 C44.1779505,48.718744 45.1807681,48.987726 46.1207573,48.736117 C47.0607465,48.4845081 47.7951005,47.7505335 48.0471953,46.8106746 C48.2992902,45.8708156 48.0308266,44.8678591 47.3429323,44.1796091 L39.3942597,36.2309364 L47.6276668,27.9975293 C48.7208084,26.9023966 48.7208084,25.1262904 47.6276668,24.0291665 M35.453773,65.8473081 C19.0526668,65.8473081 5.75377299,52.5484143 5.75377299,36.1473081 C5.75377299,19.7422196 19.0526668,6.44730814 35.453773,6.44730814 C51.8568703,6.44730814 65.153773,19.7422196 65.153773,36.1473081 C65.153773,52.5484144 51.8568703,65.8473081 35.453773,65.8473081"
                          fill="#E94949"
                        ></path>
                      </g>
                    </g>
                    <ellipse fill="#D8D8D8" filter="url(#filter-1)" cx="35.75" cy="85.8" rx="24.42" ry="3.3"></ellipse>
                  </g>
                </g>
              </g>
            </svg>
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

<script lang="ts" setup>
import API_ORDER from '@/apis/order';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

onMounted(() => {
  getDetail();
});

const router = useRouter();
const route = useRoute();

const orderInfo = ref<Recordable>({});

function goOrder() {
  router.replace({
    path: '/order/list',
  });
}

function goHome() {
  router.replace({
    path: '/',
  });
}

function getDetail() {
  API_ORDER.orderDetail({ orderNumber: route.query.orderNumber }).then((res) => {
    orderInfo.value = res.data?.orderInfo ?? {};
  });
}
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

  .svg-icon {
    width: 41px;
    height: 47.5px;
    fill: currentColor;
    overflow: hidden;
  }

  &-bd {
    margin-left: 10px;
  }

  &-icon {
    color: var(--brand-color);
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
