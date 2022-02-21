import request from '@/utils/http/request';

/**
 * 读取配送费设置
 */
export function peisonFeeList(data) {
  return request({
    url: `/fee/peisong/list`,
    method: 'get',
    params: data,
  });
}

/**
 * 关闭订单
 */
export function orderClose(data) {
  return request({
    url: `/order/close`,
    method: 'post',
    data,
  });
}

/**
 * 创建订单[下单]
 */
export function orderCreate(data) {
  return request({
    url: `/order/create`,
    method: 'post',
    data,
  });
}

/**
 * 删除订单
 */
export function orderDelete(data) {
  return request({
    url: `/order/delete`,
    method: 'post',
    data,
  });
}

/**
 * 确认收货
 */
export function orderDelivery(data) {
  return request({
    url: `/order/delivery`,
    method: 'post',
    data,
  });
}

/**
 * 订单详情
 */
export function orderDetail(data) {
  return request({
    url: `/order/detail`,
    method: 'get',
    params: data,
  });
}

/**
 * 订单列表
 */
export function orderList(data) {
  return request({
    url: `/order/list`,
    method: 'post',
    data,
  });
}

/**
 * 钱包支付订单
 */
export function orderPay(data) {
  return request({
    url: `/order/pay`,
    method: 'post',
    data,
  });
}

/**
 * 获取订单退款记录
 */
export function orderRefund(data) {
  return request({
    url: `/order/refund`,
    method: 'get',
    params: data,
  });
}

/**
 * 申请售后
 */
export function orderRefundApplyApply(data) {
  return request({
    url: `/order/refundApply/apply`,
    method: 'post',
    data,
  });
}

/**
 * 撤销退换货申请
 */
export function orderRefundApplyCancel(data) {
  return request({
    url: `/order/refundApply/cancel`,
    method: 'post',
    data,
  });
}

/**
 * 退换货详情
 */
export function orderRefundApplyInfo(data) {
  return request({
    url: `/order/refundApply/info`,
    method: 'get',
    params: data,
  });
}

/**
 * 评价接口
 */
export function orderReputation(data) {
  return request({
    url: `/order/reputation`,
    method: 'post',
    data,
  });
}

/**
 * 获取订单设置信息
 */
export function orderSet(data) {
  return request({
    url: `/order/set`,
    method: 'get',
    params: data,
  });
}

/**
 * 开始周期性订阅,针对已经停止的订阅重新开启
 */
export function orderStartOrderPeriod(data) {
  return request({
    url: `/order/startOrderPeriod`,
    method: 'post',
    data,
  });
}

/**
 * 订单统计
 */
export function orderStatistics(data) {
  return request({
    url: `/order/statistics`,
    method: 'get',
    params: data,
  });
}

export default {
  peisonFeeList,
  orderClose,
  orderCreate,
  orderDelete,
  orderDelivery,
  orderDetail,
  orderList,
  orderPay,
  orderRefund,
  orderRefundApplyApply,
  orderRefundApplyCancel,
  orderRefundApplyInfo,
  orderReputation,
  orderSet,
  orderStartOrderPeriod,
  orderStatistics,
};
