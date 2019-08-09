<template>
  <div class="contaienr">
    <van-address-edit :address-info="addressInfo"
      :area-list="areaList"
      show-postal
      :show-delete="status==1"
      show-set-default
      @save="onSave"
      @delete="onDelete" />
  </div>
</template>

<script>
import { AddressEdit } from 'vant'
import areaList from '@/common/area'
import { storage } from '@/common/util'
import { isEmpty } from '@/common/validate'

export default {
  components: {
    [AddressEdit.name]: AddressEdit
  },
  data() {
    return {
      status: 0, // 0添加地址,1修改地址
      addressInfo: {},
      areaList: areaList,
      searchResult: []
    }
  },
  created() {
    if (this.$route.query.id) {
      this.status = 1
      this.$request.get('/user/shipping-address/detail', { id: this.$route.query.id, token: storage.get('token') }).then(res => {
        this.addressInfo = {
          id: res.data.id,
          name: res.data.linkMan,
          tel: res.data.mobile,
          province: res.data.provinceStr,
          city: res.data.cityStr,
          county: res.data.areaStr,
          addressDetail: res.data.address,
          postalCode: res.data.code,
          areaCode: res.data.districtId,
          isDefault: res.data.isDefault
        }
      })
    }
  },
  methods: {
    onSave(form) {
      console.log(form)
      if (isEmpty(form.postalCode)) {
        this.$toast('请填写邮政编码')
        return
      }
      this.updateAddress(form)
    },
    updateAddress(form) {
      let addressAction = 'update'; let params = {}
      this.$route.query.id ? addressAction = 'update' : addressAction = 'add'
      params = {
        id: this.$route.query.id,
        token: storage.get('token'),
        linkMan: form.name,
        mobile: form.tel,
        isDefault: form.isDefault,
        address: form.province + (form.city === form.province ? '' : form.city) + (form.county === form.city ? '' : form.county) + form.addressDetail,
        provinceId: form.areaCode.slice(0, 2) + '0000',
        cityId: form.areaCode.slice(0, 4) + '00',
        districtId: form.areaCode,
        code: form.postalCode
      }
      this.$toast.loading({
        mask: true,
        message: '地址数据提交中...',
        duration: 0
      })
      this.$request.post(`/user/shipping-address/${addressAction}`, params).then(res => {
        // 已参团不做处理，提交订单时后端会提示
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.$toast.clear()
        this.$router.go(-1)
      })
    },
    deleteAddress(params) {
      this.$toast.loading({
        mask: true,
        message: '地址数据提交中...',
        duration: 0
      })
      this.$request.post('/user/shipping-address/delete', params).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
        }
        this.$toast.clear()
        this.$router.go(-1)
      })
    },
    onDelete() {
      this.deleteAddress({
        token: storage.get('token'),
        id: this.addressInfo.id
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

