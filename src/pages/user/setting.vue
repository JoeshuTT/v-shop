<template>
  <div class="container">
    <div class="header">
      <img class="header-img" :src="userInfo.avatarUrl" alt="">
      <van-uploader :after-read="afterRead">
        <van-button plain size="small" round icon="photo" type="primary">更换头像</van-button>
      </van-uploader>
      <!-- <input type="file" accept="image/*" class="van-uploader__input" @change="onChange($event)" @input="onInput"> -->
    </div>
    <div class="main">
      <van-cell-group>
      <van-field v-model="userInfo.nick" label="昵称" placeholder="请输入用户名" />
      <van-field readonly
        clickable
        label="所在地"
        :value="address"
        placeholder="选择城市"
        @click="showPicker = true" />

    </van-cell-group>
    <van-button type="danger" size="large" @click="onSubmit">提交修改</van-button>
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-area :area-list="areaList" :columns-num="2" @cancel="showPicker=false" @confirm="onAreaConfirm" />
    </van-popup>
  </div>
</template>
<script>
import { Field, Uploader, Area } from 'vant'
import areaList from '@/common/area'
import { storage } from '@/common/util'
import { isEmpty } from '@/common/validate'

export default {
  components: {
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Area.name]: Area
  },
  data() {
    return {
      areaList,
      userInfo: {},
      showPicker: false
    }
  },
  computed: {
    address() {
      if (this.userInfo.province === this.userInfo.city) {
        return this.userInfo.city
      }
      return this.userInfo.province + this.userInfo.city
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.$request.get('/user/detail', { token: storage.get('token') }).then(res => {
        if (res.code !== 0) {
          return
        }
        const baseInfo = res.data.base
        this.userInfo = {
          ...res.data.base,
          avatarUrl: baseInfo.avatarUrl || `${require('@/assets/avatar_default.png')}`,
          nick: baseInfo.nick || `${baseInfo.sourceStr}${baseInfo.id}`,
          mobile: baseInfo.mobile || ''
        }
      })
    },
    onSubmit() {
      let avatarUrl = this.userInfo.avatarUrl
      if (isEmpty(this.userInfo.nick)) {
        this.$toast('昵称不能为空')
        return
      }
      // if(isEmpty(this.userInfo.province)){
      //   this.$toast('省份不能为空')
      //   return;
      // }
      // if(isEmpty(this.userInfo.city)){
      //   this.$toast('城市不能为空')
      //   return;
      // }
      if (avatarUrl.includes('avatar_default') || avatarUrl.includes('base64')) {
        console.log('默认头像')
        avatarUrl = ''
      }

      this.$toast.loading({
        mask: true,
        message: '提交中...',
        duration: 0
      })

      this.updateUserInfo(avatarUrl, this.userInfo.city, this.userInfo.nick, this.userInfo.province)
    },
    updateUserInfo(avatarUrl, city, nick, province) {
      this.$request.post('/user/modify', { token: storage.get('token'), avatarUrl, city, nick, province }).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.$store.commit('updateUserInfo', this.userInfo)
        this.$toast('资料修改成功')
        this.$router.go(-1)
      })
    },
    afterRead(file) {
      this.$toast.loading({
        mask: true,
        message: '上传中...',
        duration: 0
      })
      const formData = new FormData()
      formData.append('upfile', file.file, 'avatar.jpg')
      formData.append('token', storage.get('token'))
      this.$request.uploadFile('/dfs/upload/file', formData).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return
        }
        this.userInfo.avatarUrl = res.data.url
        this.$toast('上传图片成功')
      })
    },
    onAreaConfirm(values) {
      this.userInfo.province = values[0].name
      this.userInfo.city = values[1].name
      this.showPicker = false
    }
  }
}
</script>
<style lang="less" scoped>
  .header{
    height:180px;
    // background:#FF7871;
    background:linear-gradient(309deg,rgba(255,112,61,1) 0%,rgba(255,70,57,1) 100%);
    display: flex;
    justify-content: space-around;
    align-items: center;
    &-img{
      width:80px;
      height:80px;
      border-radius:50%;
      overflow:hidden;
    }
  }
  .main{
    margin:-30px 15px 15px 15px;
    border-radius: 8px;
    overflow: hidden;
    background:#fff;
  }
</style>

