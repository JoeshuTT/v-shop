import type { AxiosError } from 'axios';
import { ServiceResultCodeEnum, ServiceResult } from './types';
import { useUserStoreWithOut } from '@/store/modules/user';
import { showToast, closeToast } from 'vant';
import { requestOptions } from './index';

/**
 * 业务错误
 * @param {ServiceResult} res 业务约定的返回数据
 * @param {number} res.code 业务约定的错误码
 * @param {string} res.msg 业务上的错误信息
 * @param {*} res.data
 */
export function serviceErrorHandle(res: ServiceResult) {
  const { code, msg } = res;
  if (Number(code) === ServiceResultCodeEnum.LOGIN_EXPIRED) {
    closeToast();

    const userStore = useUserStoreWithOut();
    userStore.logout({ goLogin: true });
  } else {
    if (requestOptions.errorMessageMode === 'message') {
      showToast({
        message: msg || 'Result Error',
        duration: 1000 * 3,
      });
    }
  }
}

/**
 * HTTP 错误
 */
export function httpErrorHandle(error: AxiosError) {
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

  showToast({
    message: msg || 'Http Error',
    duration: 1000 * 3,
  });
}
