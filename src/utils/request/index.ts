// axios配置  可自行根据项目进行更改

import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { VAxios } from './Axios';
import qs from 'qs';

import { getAPI } from '@/utils';
import { deepClone } from '@/utils/lodash';

import { useUserStoreWithOut } from '@/store/modules/user';
import { RequestInterceptors, ServiceResult, HttpResult } from './types';
import { httpErrorHandle, serviceErrorHandel } from './handler';

const interceptors: RequestInterceptors = {
  /**
   * 请求拦截器处理
   */
  requestInterceptors: (config) => {
    const userStore = useUserStoreWithOut();
    userStore.token && (config.headers.token = userStore.getToken);

    // if (config.method === 'get') {
    //   config.params = { ...config.params, token: userStore.getToken };
    // }

    return config;
  },

  /**
   *   响应拦截器处理
   */
  responseInterceptors: (response: AxiosResponse<any>) => {
    const result = response.data;
    const { code } = result;

    if (Number(code) === 0) {
      return result;
    } else if (Number(code) === 700) {
      result.data = null;
      return result;
    } else {
      serviceErrorHandel(result);
      return Promise.reject(result);
    }
  },
  /**
   *  响应错误处理
   */
  responseInterceptorsCatch: (err: AxiosError) => {
    httpErrorHandle(err);
    return Promise.reject(err);
  },
};

const vAxios = new VAxios({
  baseURL: getAPI(),
  timeout: 1000 * 5,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformRequest: [
    (data, headers) => {
      if (headers['Content-Type']?.includes('form-data')) {
        return data;
      } else {
        const userStore = useUserStoreWithOut();
        return qs.stringify({ ...data, token: userStore.getToken }); // 序列化请求参数
      }
    },
  ],
  // 拦截器
  interceptors,
});

function createRequest(config) {
  console.log(`createRequest`, config);
  return vAxios.request(config);
}

export const request = createRequest;
