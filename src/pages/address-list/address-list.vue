<template>
  <div class="contaienr">
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      :switchable="isChoose"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    >
    <div class="no-data" slot="top" v-if="!list.length">
      {{noTips}}
    </div>
    </van-address-list>
  </div>
</template>

<script>
import { AddressList } from 'vant'
import { storage } from '@/common/util'
import { mapMutations } from 'vuex'
let flag
export default {
  components: {
    [AddressList.name]: AddressList
  },
  data() {
    return {
      chosenAddressId: '',
      list: [],
      noTips: '您还没有地址信息',
      isChoose: false
    }
  },
  created() {
    this.isChoose = this.$route.query.isChoose ? this.$route.query.isChoose : false
    flag = false
    this.$request.get('/user/shipping-address/list', { token: storage.get('token') }).then(res => {
      const list = res.data || []
      list.forEach(item => {
        // item.id= item.id
        item.name = item.linkMan
        item.tel = item.mobile
        // item.address = item.address
      })
      this.list = list
    })
  },
  methods: {
    ...mapMutations(['updateDefaultAddress']),
    onAdd() {
      this.$router.push({ path: 'address-edit' })
    },
    onEdit(item) {
      this.$router.push({ path: 'address-edit', query: { id: item.id }})
    },
    onSelect(item) {
      if (!this.isChoose) return
      // ?会触发2次方法
      if (!flag) {
        flag = true
        this.$router.back(-1)
        // this.$bus.$emit('defaultAddress',item)
        this.updateDefaultAddress(item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .no-data{
    font-size: 16px;
    color:#999;
    text-align: center;
    padding-top: 150px;
  }
</style>

