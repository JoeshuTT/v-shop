<script lang="ts">
import { defineComponent } from 'vue';
import { Toast } from 'vant';
import Compressor from 'compressorjs';
import API_DFS from '@/apis/dfs';

export default defineComponent({
  name: 'Upload',
  emits: ['onSuccess', 'onError'],
  setup(_props, { emit }) {
    function beforeRead(file): any {
      return new Promise((resolve) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          success: (result) => {
            resolve(result);
          },
          error: (error) => {
            console.error(`[Compressor error]`, error);
            emit('onError', error);
          },
        });
      });
    }
    function afterRead(file) {
      const formData = new FormData();
      formData.append('upfile', file.file);

      Toast.loading({
        forbidClick: true,
        message: '上传中...',
        duration: 0,
      });

      API_DFS.dfsUploadFile(formData)
        .then((res) => {
          Toast.clear();
          if (res.data.url) {
            emit('onSuccess', res);
          } else {
            Toast({
              message: res.data.msg,
              duration: 1500,
            });
            emit('onError', res);
          }
        })
        .catch((error) => {
          emit('onError', error);
        });
    }

    return {
      beforeRead,
      afterRead,
    };
  },
});
</script>

<template>
  <van-uploader :before-read="beforeRead" :after-read="afterRead"> <slot /> </van-uploader>
</template>
