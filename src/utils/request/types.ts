import type { AxiosRequestConfig } from 'axios';

export interface CustomRequestConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions;
}

export type ErrorMessageMode = 'none' | 'message' | undefined;

export interface RequestOptions {
  /** 是否需要对返回数据进行处理 */
  isTransformResponse?: boolean;
  /** 是否直接返回原生响应 */
  isReturnNativeResponse?: boolean;
  /** 消息提示类型 */
  errorMessageMode?: ErrorMessageMode;
}

export enum ContentTypeEnum {
  // json
  JSON = 'application/json',
  // form-urlencoded qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  // form-data  upload
  FORM_DATA = 'multipart/form-data',
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

/**
 * 业务约定的全局错误码
 */
export enum ServiceResultCodeEnum {
  /** 响应成功 */
  SUCCESS = 0,
  /** 服务器内部错误 */
  ERROR = -1,
  /** 暂无数据 */
  NO_DATA = 700,
  /** 当前登录token无效，请重新登录 */
  LOGIN_EXPIRED = 2000,
}
