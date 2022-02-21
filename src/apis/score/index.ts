import { defRequest } from '@/utils/http/request';

/**
 * 积分兑换成长值
 */
export function growthExchange(data?: Recordable) {
  return defRequest({
    url: `/growth/exchange`,
    method: 'post',
    data,
  });
}

/**
 * 获取积分抵扣规则
 */
export function scoreDeductionRules(data?: Recordable) {
  return defRequest({
    url: `/score/deduction/rules`,
    method: 'get',
    params: data,
  });
}

/**
 * 积分券兑换积分
 */
export function scoreExchange(data?: Recordable) {
  return defRequest({
    url: `/score/exchange`,
    method: 'post',
    data,
  });
}

/**
 * 积分兑换成现金
 */
export function scoreExchangeCash(data?: Recordable) {
  return defRequest({
    url: `/score/exchange/cash`,
    method: 'post',
    data,
  });
}

/**
 * 积分明细记录
 */
export function scoreLogs(data?: Recordable) {
  return defRequest({
    url: `/score/logs`,
    method: 'post',
    data,
  });
}

/**
 * 用户积分排行榜
 */
export function scoreRank(data?: Recordable) {
  return defRequest({
    url: `/score/rank`,
    method: 'get',
    params: data,
  });
}

/**
 * 用户主动扣除积分
 */
export function scoreReduce(type, data?: Recordable) {
  return defRequest({
    url: `/score/reduce/${type}`,
    method: 'post',
    data,
  });
}

/**
 * 积分赠送规则
 */
export function scoreSendRule(data?: Recordable) {
  return defRequest({
    url: `/score/send/rule`,
    method: 'post',
    data,
  });
}

export default {
  growthExchange,
  scoreDeductionRules,
  scoreExchange,
  scoreExchangeCash,
  scoreLogs,
  scoreRank,
  scoreReduce,
  scoreSendRule,
};
