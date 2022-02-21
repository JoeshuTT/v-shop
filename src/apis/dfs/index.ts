import { defRequest } from '@/utils/http/request';

/**
 * 上传本地文件至服务器
 */
export function dfsUploadFile(data: any) {
  return defRequest({
    url: `/dfs/upload/file`,
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export default {
  dfsUploadFile,
};
