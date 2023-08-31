import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import qs from 'qs';
import { getAPI } from '@/utils';
import { RequestOptions, CustomRequestConfig, ServiceResultCodeEnum, ServiceResult, ContentTypeEnum } from './types';
import { httpErrorHandle, serviceErrorHandle } from './handler';
import { useUserStoreWithOut } from '@/store/modules/user';

/**
 * 扩展请求配置项，下面的选项都可以在独立的接口请求中覆盖
 */
export let requestOptions: RequestOptions = {};

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  // 基础接口地址
  baseURL: getAPI(),
  // 请求超时事件
  timeout: 1000 * 5,
  // 使用 form-urlencoded 格式，即伪表单
  headers: {
    'Content-Type': ContentTypeEnum.FORM_URLENCODED,
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  // 追加token
  // userStore.getToken && (config.headers.token = userStore.getToken);
  const userStore = useUserStoreWithOut();
  const joinPayloadData = (data: any) => {
    return { ...data, token: userStore.getToken };
  };

  // 序列化数据
  const contentType = config.headers?.['Content-Type'];
  if (contentType === ContentTypeEnum.FORM_URLENCODED) {
    if (['post', 'put', 'patch'].includes(config.method as string)) {
      config.data = qs.stringify(joinPayloadData(config.data));
    }

    if (['delete', 'get', 'head'].includes(config.method as string)) {
      config.params = joinPayloadData(config.params);
    }
  }

  return config;
});

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const result: ServiceResult = response.data;
    const { code } = result;

    // 不进行任何处理，直接返回原生响应
    if (requestOptions.isReturnNativeResponse) {
      return response;
    }

    // 不进行任何处理，直接返回数据
    if (!requestOptions.isTransformResponse) {
      return result;
    }

    if (Number(code) === ServiceResultCodeEnum.SUCCESS) {
      return result;
    } else if (Number(code) === ServiceResultCodeEnum.NO_DATA) {
      result.data = null;
      return result;
    } else {
      serviceErrorHandle(result);
      return Promise.reject(result);
    }
  },
  (error: AxiosError) => {
    httpErrorHandle(error);
    return Promise.reject(error);
  },
);

/**
 * 通用请求函数
 */
export function request<T = ServiceResult>(config: CustomRequestConfig): Promise<T> {
  requestOptions = {
    isTransformResponse: true,
    isReturnNativeResponse: false,
    errorMessageMode: 'message',
    ...config.requestOptions,
  };

  return new Promise((resolve, reject) => {
    instance
      .request<any, AxiosResponse<ServiceResult>>(config)
      .then((res: AxiosResponse<ServiceResult>) => {
        resolve(res as unknown as Promise<T>);
      })
      .catch((e: Error | AxiosError) => {
        reject(e);
      });
  });
}
