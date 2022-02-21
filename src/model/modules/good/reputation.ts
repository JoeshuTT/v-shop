import { assets } from '@/constants';
import { mobileShow } from '@/utils/format';

/**
 * 后端评价转换前端评价数
 * @description // 只有 0 差评 1 中评 2 好评
 */
export function rate2Reputation(val: number) {
  switch (val) {
    case 0:
      return 1;
    case 1:
      return 3;
    case 2:
      return 5;
    default:
      return 5;
  }
}

/**
 * 前端评价转换后端评价数
 * @description // 只有 0 差评 1 中评 2 好评
 */
export function reputation2Rate(val: number) {
  switch (val) {
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 1;
    case 4:
      return 2;
    case 5:
      return 2;
    default:
      return 2;
  }
}

/**
 *  商品评价
 * @param {*} data
 */
export function goodReputationModel(data: Recordable) {
  return data.map((v: any) => ({
    goodId: v.goods.id,
    avatarUrl: v.user.avatarUrl || assets.avatar,
    nickName: v.user.nick || (v.user.mobile ? mobileShow(v.user.mobile) : `神秘用户`),
    rate: rate2Reputation(v.goods.goodReputationStr),
    remark: v.goods.goodReputationRemark || '此用户没有填写评价',
    date: v.goods.dateReputation.slice(0, 10),
    property: v.goods.property,
  }));
}
