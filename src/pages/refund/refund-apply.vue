 <template>
  <div class="contaienr">
    <div class="header" v-if="refundApplyInfo.baseInfo">
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 0">已申请，等待处理</div>
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 2">本次申请已拒绝，请联系客服</div>
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 3">正在处理中</div>
      <div class="header-title" v-if="refundApplyInfo.baseInfo.status === 4">已成功退换货</div>
    </div>
    <div class="main">
      <van-radio-group v-model="type" >
        <van-cell-group title="选择服务类型">
          <van-cell :title="item.name" @click="onChangeType(item.value)" v-for="(item,index ) in typeItems" :key="index">
            <van-radio :name="item.value" checked-color="#ff703d" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-radio-group class="mb20" v-model="logisticsStatus">
        <van-cell-group title="选择货物状态">
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
        placeholder="退换货原因"
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
      <!-- 上传图片(空间有限省略) -->
    <div class="affix-bar">
      <div class="affix-bar__bar">
        <template v-if="refundApplyInfo.baseInfo">
          <van-button v-if="refundApplyInfo.baseInfo.status === 0" square size="large" type="danger" @click="onRefundApplyCancel">撤回本次申请</van-button>
          <van-button v-if="refundApplyInfo.baseInfo.status === 2" square size="large" type="danger" @click="onRefundApplyCancel">本次申请已拒绝，请联系客服</van-button>
          <van-button v-if="refundApplyInfo.baseInfo.status === 3" square size="large" type="info" disabled>等待处理</van-button>
          <van-button v-if="refundApplyInfo.baseInfo.status === 4" square size="large" type="primary" disabled>处理完毕</van-button>
        </template>
        <template v-else>
          <van-button square size="large" type="danger" @click="onRefundApplySubmit">立即申请售后</van-button>
        </template>
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
import { RadioGroup, Radio, Picker, Field } from 'vant'
import { storage } from '@/common/util'

export default {
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Picker.name]: Picker,
    [Field.name]: Field
  },
  data() {
    return {
      type: 0,
      typeItems: [
        { name: '我要退款(无需退货)', value: 0 },
        { name: '我要退货退款', value: 1 },
        { name: '我要换货', value: 2 }
      ],
      logisticsStatus: 0,
      logisticsStatusItems: [
        { name: '未收到货', value: 0 },
        { name: '已收到货', value: 1 }
      ],
      reason: '',
      reasonItems: [
        '不喜欢/不想要',
        '空包裹',
        '未按约定时间发货',
        '快递/物流一直未送达',
        '货物破损已拒签',
        '退运费',
        '规格尺寸与商品页面描述不符',
        '功能/效果不符',
        '质量问题',
        '少件/漏发',
        '包装/商品破损',
        '发票问题'
      ],
      showPicker: false,
      amount: '',
      remark: '',
      refundApplyInfo: {}
    }
  },
  watch: {
    type(val) {
      if (val > 0) {
        this.logisticsStatus = 1
      }
    },
    logisticsStatus(val) {
      if (val > 0) {
        this.type = 0
      }
    }
  },
  created() {
    this.amount = this.$route.query.amount
    this.getRefundApplyInfo()
  },
  methods: {
    getRefundApplyInfo() {
      this.$request.get('/order/refundApply/info', { orderId: this.$route.query.orderId, token: storage.get('token') }).then(res => {
        if (res.code !== 0) {
          return
        }
        this.refundApplyInfo = res.data[0] // baseInfo, pics
        const baseInfo = res.data[0].baseInfo
        this.amount = baseInfo.amount
        this.logisticsStatus = baseInfo.logisticsStatus
        this.type = baseInfo.type
        this.reason = baseInfo.reason
        this.remark = baseInfo.remark
      })
    },
    onChangeType(value) {
      this.type = value
    },
    onConfirm(value) {
      this.reason = value
      this.showPicker = false
    },
    onRefundApplyCancel() {
      this.$request.post('/order/refundApply/cance', { orderId: this.$route.query.orderId, token: storage.get('token') }).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.$toast('撤销申请成功')
        this.$router.go(-1)
      })
    },
    onRefundApplySubmit() {
      if (!this.reason) {
        this.$toast('请选择退换货原因')
        return
      }
      const params = {
        orderId: this.$route.query.orderId,
        token: storage.get('token'),
        amount: this.typ === 2 ? 0 : this.amount,
        type: this.type,
        logisticsStatus: this.logisticsStatus,
        reason: this.reason,
        remark: this.remark
      }
      this.$request.post('/order/refundApply/apply', params).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.$dialog.confirm({
          title: '提示',
          message: '提交成功，请耐心等待我们处理！',
          showCancelButton: false,
          confirmButtonText: '我知道了'
        }).then(() => {
          // on confirm
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .van-radio{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
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

