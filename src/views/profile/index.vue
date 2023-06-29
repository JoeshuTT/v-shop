<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import API_USER from '@/apis/user';
import UploadAvatar from '@/components/UploadAvatar/index.vue';
import { isEmpty } from '@/utils/validate';
import { assets } from '@/constants';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';

onMounted(() => {
  avatarUrl.value = unref(userInfo).avatarUrl ?? '';
  nick.value = unref(userInfo).nick ?? '';
  province.value = unref(userInfo).province ?? '';
  city.value = unref(userInfo).city ?? '';
});

const router = useRouter();
const userStore = useUserStore();

const userInfo = computed(() => userStore.getUserInfo);
const avatarUrl = ref('');
const nick = ref('');
const province = ref('');
const city = ref('');
const areaLabel = computed(() => {
  if (!unref(province)) {
    return '';
  }

  if (unref(province) === unref(city)) {
    return unref(city);
  }

  return `${unref(province)} - ${unref(city)}`;
});

function onFileSuccess(res: any) {
  avatarUrl.value = res.data.url;
}

function onAreaChange({ selectedOptions }) {
  province.value = selectedOptions[0].text;
  city.value = selectedOptions[1].text;
}

function onSubmit() {
  if (
    unref(avatarUrl) === unref(userInfo).avatarUrl &&
    unref(nick) === unref(userInfo).nick &&
    unref(province) === unref(userInfo).province &&
    unref(city) === unref(userInfo).city
  ) {
    showToast('您没有修改任何东西哦');
    return;
  }
  if (isEmpty(unref(nick))) {
    showToast('昵称不能为空');
    return;
  }

  if (isEmpty(unref(province))) {
    showToast('所在地不能为空');
    return;
  }

  const params = {
    nick: unref(nick),
    avatarUrl: unref(avatarUrl),
    province: unref(province),
    city: unref(city),
  };

  showLoadingToast({
    forbidClick: true,
    message: '提交中...',
    duration: 0,
  });

  API_USER.userModify(params)
    .then(() => {
      closeToast();
      showToast('资料修改成功');
      router.back();
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <UploadAvatar @success="onFileSuccess">
        <div class="avatar">
          <van-image class="avatar-img" :src="avatarUrl || assets.avatar" />
          <div class="avatar-title">点击更换头像</div>
        </div>
      </UploadAvatar>
    </div>
    <div class="main">
      <div class="nick">
        <div class="nick-label">昵称</div>
        <van-field v-model="nick" placeholder="12个字以内" />
      </div>
      <AreaField
        :model-value="areaLabel"
        label="所在地"
        placeholder="点击选择城市"
        input-align="right"
        :border="false"
        :columns-num="2"
        @change="onAreaChange"
      />
    </div>

    <AffixBar size="medium" @click-btn="onSubmit" />
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  padding: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-2);
}

.main {
  box-sizing: border-box;
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
    color: var(--color-text-1);
  }
}
.nick {
  padding: 20px 16px 0;
  background: var(--color-bg-2);

  &-label {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text-1);
  }

  .van-field {
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border-1);
  }
}

.field {
  :deep(.van-field__label) {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text-1);
  }
}
</style>
