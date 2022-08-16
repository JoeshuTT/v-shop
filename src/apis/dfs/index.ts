import { request } from '@/utils/request';

/**
 * 上传本地文件至服务器
 */
export function dfsUploadFile(data: any) {
  return request({
    url: `/dfs/upload/file`,
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export default {
  dfsUploadFile,
};
