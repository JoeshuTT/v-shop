import { Toast } from 'vant';

import { useUserStoreWithOut } from '@/store/modules/user';
import { RequestInterceptors, ServiceResult, HttpResult } from './types';

/**
 * 业务错误
 * @param {*} res 业务约定的返回数据
 * @param {Number} res.code 业务约定的错误码
 * @param {String} res.msg 业务上的错误信息
 * @param {*} res.data
 */
export function serviceErrorHandel(res: ServiceResult) {
  const { code, msg } = res;
  if (Number(code) === 2000) {
    Toast.clear();
    const userStore = useUserStoreWithOut();
    userStore.logout({ goLogin: true });
  } else {
    Toast({
      message: msg || 'Result Error',
      duration: 1000 * 3,
    });
  }
}

/**
 * HTTP 错误
 */
export function httpErrorHandle(error: any) {
  // console.log('[httpErrorHandle]', error);
  // console.log('[httpErrorHandle]', error.toString());

  let msg = '';

  if (error?.response) {
    const { status } = error.response;

    switch (status) {
      case 403:
        msg = `${status} 网络请求被拒绝`;
        break;
      case 404:
        msg = `${status} 网络请求不存在`;
        break;
      case 500:
        msg = `${status} 服务器内部错误`;
        break;
      default:
        msg = `${status || error.message}`;
        break;
    }
  }

  if (error.message.includes('timeout')) {
    msg = '请求超时';
  }

  if (error.message.includes('Network Error')) {
    msg = '当前网络不可用，请检查你的网络设置';
  }

  Toast({
    message: msg || error.toString(),
    duration: 1000 * 3,
  });
}
