<template>
  <div class="container">
    <div class="logo">
      <img src="../../assets/logo.png"
        alt=""
        srcset="">
    </div>
    <van-cell-group>
      <van-field v-model="mobile"
        clearable
        type="tel"
        label="手机号"
        placeholder="请输入手机号" />
      <van-field v-model="pwd"
        type="password"
        label="密码"
        placeholder="请输入密码" />
      <van-field v-model="code"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码">
        <van-button slot="button"
          size="small"
          :disabled="!!vcodeSend"
          type="primary"
          @click="handleCodeSend">{{vcodeText}}</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn-area">
      <van-button type="primary"
        size="large"
        @click="formSubmit">确定</van-button>
    </div>
  </div>
</template>
<script>
import { Field } from 'vant';
import { isPhone, isEmpty } from '@/common/validate';
import { storage } from '@/common/util';
var vcodeTimer;
export default {
  components: {
    [Field.name]: Field,
  },
  data() {
    return {
      mobile: '',
      pwd: '',
      code: '',
      vcodeSend: 0, // 0获取验证码,1验证码倒计时,
      vcodeText: '获取验证码',
      hasLogin: false,
    };
  },
  created() {
    console.dir(isPhone)

  },
  methods: {
    formSubmit() {
      if (!isPhone(this.mobile)) {
        this.$toast('手机号格式错误')
        return;
      }
      // 密码123456
      if (isEmpty(this.pwd)) {
        this.$toast('请输入正确的密码')
        return;
      }
      // 短信验证码4位数字
      if (!/^\d{4}$/.test(this.code)) {
        this.$toast('请输入正确的验证码')
        return;
      }
      // 登录中
      this.$toast.loading({
        mask: true,
        message: '登录中...',
        duration: 0
      })
      // 注册&登录...
      this.mobileRegister()
    },
    mobileRegister() {
      const params = {
        mobile: this.mobile,
        pwd: this.pwd,
        code: this.code,
        autoLogin: true,  //该参数可以自动完成登录并返回token
      }
      this.$request.post('/user/m/register', params).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return;
        }
        // this.mobileLogin()
        storage.set('token', res.data.token)
        storage.set('uid', res.data.uid)
        this.$toast('登录成功')
        this.$route.query.redirect ? this.$router.replace({ path: this.$route.query.redirect }) : this.$router.replace({ path: '/home' })
      })
    },
    mobileLogin() {
      const params = {
        deviceId: '0529',
        deviceName: '小米note3',
        mobile: this.mobile,
        pwd: this.pwd,
      }
      this.$request.post('/user/m/login', params).then(res => {
        if (res.code !== 0) {
          this.$toast(res.msg)
          return;
        }
        storage.set('token', res.data.token)
        this.$toast('登录成功')
        this.$router.replace({ path: '/home' })
      })
      // 登陆成功返回JSON
      //       {
      //   "code": 0,
      //   "data": {
      //     "uid": 869081,
      //     "token": "1423e09c-2329-4d48-ab19-fb3543312d65"
      //   },
      //   "msg": "success"
      // }
      // 50274412-f43b-4a35-a09e-a935e25556d2
    },
    handleCodeSend() {
      if (!isPhone(this.mobile)) {
        this.$toast('手机号格式错误')
        return;
      }
      if (this.vcodeSend === 1) {
        return;
      }
      clearInterval(vcodeTimer)
      let time = 60
      vcodeTimer = setInterval(() => {
        if (time <= 0) {
          this.vcodeSend = 0
          this.vcodeText = '获取验证码'
        } else {
          this.vcodeSend = 1
          this.vcodeText = `已发送(${time}s)`
          time--
        }
      }, 1000)
      this.$request.get('/verification/sms/get', { mobile: this.mobile }).then(res => {
        this.$toast('验证码发送成功')
      });
    }
  }
};
</script>

<style lang="less">
.logo {
  width: 150px;
  height: 150px;
  margin: 30px auto;
}
.btn-area {
  width: 80%;
  margin: 30px auto;
}
</style>

