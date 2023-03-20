<script lang="ts">
import { defineComponent } from 'vue';
import { Toast, UploaderFileListItem } from 'vant';
import Compressor from 'compressorjs';
import API_DFS from '@/apis/dfs';
import { blobToFile } from '@/utils/file';

export default defineComponent({
  name: 'Upload',
  emits: ['success', 'error'],
  setup(_props, { emit }) {
    function beforeRead(file: File): Promise<any> {
      return new Promise((resolve) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1024,
          success: async (result) => {
            const resultFile = await blobToFile(result, file.name, {
              type: file.type, // 使用原图文件类型
            });

            resolve(resultFile);
          },
          error: (error) => {
            console.error(`[Compressor error]`, error);
            emit('error', error);
          },
        });
      });
    }

    async function afterRead(file: UploaderFileListItem) {
      const uploadFile = file.file as File;

      const formData = new FormData();
      formData.append('upfile', uploadFile);

      Toast.loading({
        forbidClick: true,
        message: '上传中...',
        duration: 0,
      });

      API_DFS.dfsUploadFile(formData)
        .then((res) => {
          Toast.clear();

          emit('success', res);
        })
        .catch((err) => {
          console.error(err);
          Toast.clear();

          emit('error', err);
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