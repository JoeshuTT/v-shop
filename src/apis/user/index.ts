import { request } from '@/utils/request';

/**
 * 查看用户资产
 */
export function userAmount(data?: Recordable) {
  return request({
    url: `/user/amount`,
    method: 'get',
    params: data,
  });
}

/**
 * 资金流水
 */
export function userCashLog(data?: Recordable) {
  return request({
    url: `/user/cashLog/v2`,
    method: 'post',
    data,
  });
}

/**
 * 查看用户详情
 */
export function userDetail(data?: Recordable) {
  return request({
    url: `/user/detail`,
    method: 'get',
    params: data,
  });
}

/**
 * 修改用户信息
 */
export function userModify(data?: Recordable) {
  return request({
    url: `/user/modify`,
    method: 'get',
    params: data,
  });
}

/**
 * 退出登录
 */
export function userLoginOut(data?: Recordable) {
  return request({
    url: `/user/loginout`,
    method: 'get',
    params: data,
  });
}

/**
 * 绑定手机号码
 */
export function userMBindMobile(data?: Recordable) {
  return request({
    url: `/user/m/bind-mobile`,
    method: 'post',
    data,
  });
}

/**
 * 用户登录[手机号码]
 */
export function userMLogin(data?: Recordable) {
  return request({
    url: `/user/m/login`,
    method: 'post',
    data,
  });
}

/**
 * 使用手机号码和验证码登录
 */
export function userMLoginMobile(data?: Recordable) {
  return request({
    url: `/user/m/loginMobile`,
    method: 'post',
    data,
  });
}

/**
 * 用户注册[手机号]
 */
export function userMRegister(data?: Recordable) {
  return request({
    url: `/user/m/register`,
    method: 'post',
    data,
  });
}

/**
 * 重设登陆密码
 */
export function userMResetPwd(data?: Recordable) {
  return request({
    url: `/user/m/reset-pwd`,
    method: 'post',
    data,
  });
}

/**
 * 修改登陆密码
 */
export function userModifyPwd(data?: Recordable) {
  return request({
    url: `/user/modify/password`,
    method: 'post',
    data,
  });
}

/**
 * 添加收货地址
 */
export function userShoppingAddressAdd(data?: Recordable) {
  return request({
    url: `/user/shipping-address/add`,
    method: 'post',
    data,
  });
}

/**
 * 获取默认收货地址
 */
export function userShoppingAddressDefault(data?: Recordable) {
  return request({
    url: `/user/shipping-address/default/v2`,
    method: 'get',
    params: data,
  });
}

/**
 * 删除收货地址
 */
export function userShoppingAddressDelete(data?: Recordable) {
  return request({
    url: `/user/shipping-address/delete`,
    method: 'post',
    data,
  });
}

/**
 * 收货地址详情
 */
export function userShoppingAddressDetail(data?: Recordable) {
  return request({
    url: `/user/shipping-address/detail/v2`,
    method: 'get',
    params: data,
  });
}

/**
 * 收货地址列表
 */
export function userShoppingAddressList(data?: Recordable) {
  return request({
    url: `/user/shipping-address/list/v2`,
    method: 'post',
    data,
  });
}

/**
 * 修改收货地址
 */
export function userShoppingAddressUpdate(data?: Recordable) {
  return request({
    url: `/user/shipping-address/update`,
    method: 'post',
    data,
  });
}

export default {
  userAmount,
  userCashLog,
  userDetail,
  userModify,
  // 登录/注册
  userLoginOut,
  userMBindMobile,
  userMLogin,
  userMLoginMobile,
  userMRegister,
  userMResetPwd,
  userModifyPwd,
  // 收货地址
  userShoppingAddressAdd,
  userShoppingAddressDefault,
  userShoppingAddressDelete,
  userShoppingAddressDetail,
  userShoppingAddressList,
  userShoppingAddressUpdate,
};
