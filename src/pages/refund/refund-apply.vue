<template>
  <div class="contaienr">
    <div class="header">
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 0">已申请，等待处理</div>
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 2">本次申请已拒绝，请联系客服</div>
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 3">正在处理中</div>
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 4">已成功退换货</div>
    </div>
    <div class="main">
      <van-radio-group class="mb20" v-model="type" >
        <van-cell-group>
          <van-cell title="选择服务类型" />
          <van-cell :title="item.name" @click="onChangeType(item.value)" v-for="(item,index ) in typeItems" :key="index">
            <van-radio :name="item.value" checked-color="#ff703d" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-radio-group class="mb20" v-model="logisticsStatus" v-if="type===0">
        <van-cell-group>
          <van-cell title="选择货物状态" />
          <van-cell :title="item.name" @click="onChangeType(item.value)" v-for="(item,index ) in logisticsStatusItems" :key="index">
            <van-radio :name="item.value" checked-color="#ff703d" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-field
        readonly
        clickable
        label="售后原因"
        :value="reason"
        @click="showPicker = true"
      />
      <van-field
        type="number"
        v-if="type !== 2"
        v-model="amount"
        label="退款金额"
      />
      <van-field
        v-model="remark"
        label="售后说明"
        type="textarea"
        placeholder="请输入退款说明"
        rows="1"
        autosize
      />
      <!-- placeholder="退换货原因" -->
      <!-- 上传图片(空间有限省略) -->
    <div class="affix-bar">
      <div class="affix-bar__bar">
        <van-button v-if="refundApplyInfo.baseInfo.status == 0" square size="large" type="danger" @click="refundApplyCancel">撤回本次申请</van-button> 
        <van-button v-if="refundApplyInfo.baseInfo.status == 4" square size="large" type="info" disabled>等待处理</van-button>
        <van-button v-if="refundApplyInfo.baseInfo.status == 0" square size="large" type="primary" disabled>处理完毕</van-button>
        <van-button v-else square size="large" type="danger">立即申请售后</van-button>
      </div>
    </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="reasonItems"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio , Picker , Field } from 'vant'
import { storage, debounce, throttle } from '@/common/util'

export default {
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Picker.name]: Picker,
    [Field.name]: Field,
  },
  data() {
    return {
      type: 0,
      typeItems: [
        { name: '我要退款(无需退货)', value: 0 },
        { name: '我要退货退款', value: 1 },
        { name: '我要换货', value: 2 },
      ],
      logisticsStatus:0,
      logisticsStatusItems: [
        { name: '未收到货', value: 0 },
        { name: '已收到货', value: 1 }
      ],
      reason: '',
      reasonItems: [
        "不喜欢/不想要", 
        "空包裹", 
        "未按约定时间发货",
        "快递/物流一直未送达",
        "货物破损已拒签",
        "退运费",
        "规格尺寸与商品页面描述不符",
        "功能/效果不符",
        "质量问题",
        "少件/漏发",
        "包装/商品破损",
        "发票问题",
      ],
      showPicker:false,
      amount:'',
      remark:'',
      refundApplyInfo:{
        baseInfo:{
          status:0
        }
      }
    }
  },
  created() {
    this.amount = this.$route.query.amount
    this.getRefundApplyInfo(this.$route.query.orderId)
  },
  methods: {
    getRefundApplyInfo(orderId) {
      this.$request.get('/order/refundApply/info', {orderId,token: storage.get('token')}).then(res => {
        if (res.code !== 0) { 
          return;
        }
        this.refundApplyInfo = res.data[0]  // baseInfo, pics
      })
    },
    onChangeType(value){
      this.type = value
    },
    onConfirm(value) {
      this.reason = value
      this.showPicker = false
    }
  }
}
</script>

<style lang="less" scoped> 
  .header{
    box-sizing: border-box;
    // height:140px;
    height:100px;
    text-align:center;
    padding-top:40px;
    background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
    &-title{
      font-size: 20px;
      font-weight:bold;
      color:#fff;
    }
  }
  .affix-bar{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    background-color: #fff;
    user-select: none;
    &__bar{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 50px;
      font-size: 14px;
    }
    &__button{
      // width: 100%;
      // height: 50px;
      // line-height: 48px;
    }
  }
</style>


