<template>
  <van-uploader :before-read="beforeRead" :after-read="afterRead">
    <slot />
  </van-uploader>
</template>

<script>
import Compressor from 'compressorjs';
import API_DFS from '@/apis/dfs';

export default {
  methods: {
    beforeRead(file) {
      return new Promise((resolve) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          success: (result) => {
            resolve(result);
          },
          error: (error) => {
            console.error(`[Compressor error]`, error);
            this.$emit('on-error', error);
          },
        });
      });
    },
    afterRead(file) {
      const formData = new FormData();
      formData.append('upfile', file.file);

      this.$toast.loading({
        forbidClick: true,
        message: '上传中...',
        duration: 0,
      });

      API_DFS.dfsUploadFile(formData)
        .then((res) => {
          this.$toast.clear();
          if (res.data.url) {
            this.$emit('on-success', res);
          } else {
            this.$toast({
              message: res.data.msg,
              duration: 1500,
            });
            this.$emit('on-error', res);
          }
        })
        .catch((error) => {
          this.$emit('on-error', error);
        });
    },
  },
};
</script>
