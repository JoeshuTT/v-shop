import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestOptions {
  // Whether to add a timestamp
  joinTime?: boolean;
}

/**
 * 请求拦截器，响应拦截器
 */
export interface RequestInterceptors {
  /**
   * 请求之前的拦截器
   */
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  /**
   * 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: any) => any;
  /**
   * 请求响应后的拦截器
   */
  responseInterceptors?: (response: AxiosResponse<any>) => AxiosResponse<any>;
  /**
   * 请求响应后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: any) => any;
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
  interceptors?: RequestInterceptors;
  requestOptions?: RequestOptions;
}

export interface HttpResult<T = any> {
  status: number;
  message?: string;
  response?: T;
}

export interface ServiceResult<T = any> {
  code: number;
  msg: string;
  data?: T;
}

// multipart/form-data: upload file
export interface RequestUploadFileOptions {
  // Other parameters
  data?: Record<string, any>;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}
