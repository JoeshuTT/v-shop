import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type {
  CreateAxiosOptions,
  RequestOptions,
  RequestInterceptors,
  ServiceResult,
  RequestUploadFileOptions,
} from './types';
import axios from 'axios';
import { isFunction } from '@/utils/validate';
import { ContentTypeEnum } from '@/enums';

export class VAxios {
  private axiosInstance: AxiosInstance;
  private options: CreateAxiosOptions;

  public constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    console.log(options);
    this.setupInterceptors();
  }

  /**
   * @description:  File Upload
   */
  public uploadFile<T = any>(config: AxiosRequestConfig, params: RequestUploadFileOptions) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data![key]);
      });
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true,
      },
    });
  }

  /**
   * 创建 axios 实例
   */
  public request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    console.log('public request', config, options);
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<ServiceResult>>(config)
        .then((res: AxiosResponse<ServiceResult>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }

  private getInterceptors() {
    const { interceptors } = this.options;
    return interceptors;
  }

  private setupInterceptors() {
    const interceptors = this.getInterceptors();
    if (!interceptors) {
      return;
    }

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    }: RequestInterceptors = interceptors;

    // Request interceptor configuration processing
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      if (requestInterceptors && isFunction(requestInterceptors)) {
        // eslint-disable-next-line no-param-reassign
        config = requestInterceptors(config);
      }
      return config;
    }, undefined);

    // Request interceptor error capture
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // Response result interceptor processing
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      if (responseInterceptors && isFunction(responseInterceptors)) {
        // eslint-disable-next-line no-param-reassign
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // Response result interceptor error capture
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        responseInterceptorsCatch(error);
      });
  }
}
