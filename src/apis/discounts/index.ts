import { request } from '@/utils/request';

/**
 * 获取可领取优惠券列表
 */
export function discountsCoupons(data?: Recordable) {
  return request({
    url: `/discounts/coupons`,
    method: 'get',
    params: data,
  });
}

/**
 * 优惠券规格详情
 */
export function discountsDetail(data?: Recordable) {
  return request({
    url: `/discounts/detail`,
    method: 'get',
    params: data,
  });
}

/**
 * 使用优惠券-红包的动态口令兑换优惠券
 */
export function discountsExchange(data?: Recordable) {
  return request({
    url: `/discounts/exchange`,
    method: 'post',
    data,
  });
}

/**
 * 领取优惠券
 */
export function discountsFetch(data?: Recordable) {
  return request({
    url: `/discounts/fetch`,
    method: 'post',
    data,
    requestOptions: {
      errorMessageMode: 'none',
    },
  });
}

/**
 * 优惠券合并
 */
export function discountsMerge(data?: Recordable) {
  return request({
    url: `/discounts/merge`,
    method: 'post',
    data,
  });
}

/**
 * 获取优惠券合并规则
 */
export function discountsMergeList(data?: Recordable) {
  return request({
    url: `/discounts/merge/list`,
    method: 'get',
    params: data,
  });
}

/**
 * 我的优惠券
 */
export function discountsMy(data?: Recordable) {
  return request({
    url: `/discounts/my`,
    method: 'get',
    params: data,
  });
}

/**
 * 赠送优惠券
 */
export function discountsSend(data?: Recordable) {
  return request({
    url: `/discounts/send`,
    method: 'post',
    data,
  });
}

/**
 * 优惠券统计
 */
export function discountsStatistics(data?: Recordable) {
  return request({
    url: `/discounts/statistics`,
    method: 'get',
    params: data,
  });
}

export default {
  discountsCoupons,
  discountsDetail,
  discountsExchange,
  discountsFetch,
  discountsMergeList,
  discountsMy,
  discountsSend,
  discountsStatistics,
};
