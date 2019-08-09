import request from '@/common/request'
/**
 * 钱包支付
 * @param {String} orderId
 * @param {String} token
 */
export function pay_balance(orderId, token) {
  return request.post('/order/pay', { orderId, token })
}
/**
 * 公众号网页支付
 * @param {Number} money
 * @param {object} nextAction
 * @param {String} payName
 * @param {String} remark
 * @param {String} token
 */
export function wxPay_jsapi(money, nextAction, payName, remark = '', token) {
  return request.post('/pay/wx/h5', { money, nextAction, payName, remark, token })
}
