<template>
  <div class="container">
    <div class="header">
      <Upload @on-success="onFileSuccess">
        <div class="avatar">
          <van-image class="avatar-img" :src="avatarUrl || assets.avatar" />
          <div class="avatar-title">点击更换头像</div>
        </div>
      </Upload>
    </div>
    <div class="nick van-hairline--bottom">
      <div class="nick-label">昵称</div>
      <van-field v-model="nick" placeholder="12个字以内" />
    </div>
    <van-field
      readonly
      :value="areaLabel"
      label="所在地"
      placeholder="点击选择城市"
      input-align="right"
      is-link
      :border="false"
      @click="showPicker = true"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-area :area-list="areaList" :columns-num="2" @cancel="showPicker = false" @confirm="onAreaConfirm" />
    </van-popup>

    <AffixBarAction @submit="onSubmit" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import API_USER from '@/apis/user';
import AffixBarAction from '@/components/AffixBarAction';
import Upload from '@/components/Upload';
import { isEmpty } from '@/utils/validate';
import { assets } from '@/utils/constant';
import { areaList } from '@vant/area-data';

export default {
  components: { AffixBarAction, Upload },
  data() {
    return {
      assets,
      areaList,
      avatarUrl: '',
      nick: '',
      province: '',
      city: '',
      showPicker: false,
    };
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
    }),
    areaLabel() {
      if (!this.province) {
        return '';
      }

      if (this.province === this.city) {
        return this.city;
      }

      return `${this.province} - ${this.city}`;
    },
  },
  created() {
    this.avatarUrl = this.userInfo.avatarUrl ?? '';
    this.nick = this.userInfo.nick ?? '';
    this.province = this.userInfo.province ?? '';
    this.city = this.userInfo.city ?? '';
  },
  methods: {
    onFileSuccess(res) {
      this.avatarUrl = res.data.url;
    },
    onAreaConfirm(values) {
      this.province = values[0].name;
      this.city = values[1].name;
      this.showPicker = false;
    },
    onSubmit() {
      if (
        this.avatarUrl === this.userInfo.avatarUrl &&
        this.nick === this.userInfo.nick &&
        this.province === this.userInfo.province &&
        this.city === this.userInfo.city
      ) {
        this.$toast('您没有修改任何东西哦');
        return;
      }
      if (isEmpty(this.nick)) {
        this.$toast('昵称不能为空');
        return;
      }

      if (isEmpty(this.province)) {
        this.$toast('所在地不能为空');
        return;
      }

      const params = {
        nick: this.nick,
        avatarUrl: this.avatarUrl,
        province: this.province,
        city: this.city,
      };

      this.$toast.loading({
        forbidClick: true,
        message: '提交中...',
        duration: 0,
      });

      API_USER.userModify(params)
        .then(() => {
          this.$toast('资料修改成功');
          this.$router.back();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  box-sizing: border-box;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10px;
  }

  &-title {
    font-size: 14px;
    color: var(--gray-color-8);
  }
}
.nick {
  padding: 0 16px;
  background: var(--white);

  &.van-hairline--bottom::after {
    right: -40%;
    left: -40%;
  }

  &-label {
    font-size: 14px;
    font-weight: bold;
    color: var(--gray-color-8);
  }

  .van-field {
    padding: 10px 0;
  }
}

.field {
  ::v-deep .van-field__label {
    font-size: 14px;
    font-weight: bold;
    color: var(--gray-color-8);
  }
}
</style>
