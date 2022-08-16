import { getAPI } from '@/utils';
import request from '@/utils/request';
import qs from 'qs';

/**
 * 校验邮件验证码是否正确
 */
export function verificationMailCheck(data) {
  return request({
    url: `/verification/mail/check`,
    method: 'post',
    data,
  });
}

/**
 * 获取邮件验证码
 */
export function verificationMailGet(data) {
  return request({
    url: `/verification/mail/get`,
    method: 'get',
    params: data,
  });
}

/**
 * 校验图片验证码是否正确
 */
export function verificationPicCheck(data) {
  return request({
    url: `/verification/pic/check`,
    method: 'post',
    data,
  });
}

/**
 * 获取图形验证码
 */
export function verificationPicGet(data) {
  return `${getAPI()}/verification/pic/get?${qs.stringify(data)}`;
}

/**
 * 校验短信验证码是否正确
 */
export function verificationSmsCheck(data) {
  return request({
    url: `/verification/sms/check`,
    method: 'post',
    data,
  });
}

/**
 * 获取短信验证码
 */
export function verificationSmsGet(data) {
  return request({
    url: `/verification/sms/get`,
    method: 'get',
    params: data,
  });
}

/**
 * 获取短信验证码[发送至当前绑定手机]
 */
export function verificationSmsGetByToken(data) {
  return request({
    url: `/verification/sms/get-by-token`,
    method: 'get',
    params: data,
  });
}

export default {
  verificationMailCheck,
  verificationMailGet,
  verificationPicCheck,
  verificationPicGet,
  verificationSmsCheck,
  verificationSmsGet,
  verificationSmsGetByToken,
};
