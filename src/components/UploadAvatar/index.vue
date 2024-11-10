<script setup lang="ts">
import type { UploaderFileListItem } from 'vant';
import API_DFS from '@/apis/dfs';
import { blobToFile } from '@/utils/file';
import Compressor from 'compressorjs';
import { closeToast, showLoadingToast } from 'vant';

const emit = defineEmits(['success', 'error']);
function beforeRead(file: File | File[]): undefined | Promise<File | File[] | undefined> {
  if (Array.isArray(file))
    return;

  // eslint-disable-next-line no-new
  new Compressor(file, {
    quality: 0.8,
    maxWidth: 1024,
    success: (result) => {
      const resultFile = blobToFile(result, file.name);

      return Promise.resolve(resultFile);
    },
    error: (err) => {
      console.error(`[Compressor error]`, err);
      emit('error', err);
    },
  });
};

function afterRead(file: UploaderFileListItem | UploaderFileListItem[]) {
  if (Array.isArray(file))
    return;

  const uploadFile = file.file as File;

  const formData = new FormData();
  formData.append('upfile', uploadFile);

  showLoadingToast({
    forbidClick: true,
    message: '上传中...',
    duration: 0,
  });

  API_DFS.dfsUploadFile(formData)
    .then((res) => {
      closeToast();

      emit('success', res);
    })
    .catch((err) => {
      console.error(err);
      closeToast();

      emit('error', err);
    });
}
</script>

<template>
  <van-uploader :before-read="beforeRead" :after-read="afterRead">
    <slot />
  </van-uploader>
</template>
