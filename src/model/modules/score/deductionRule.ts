import ICON_MONEY from '@/assets/images/74351043305a48e90e17c26d215e6dc5.png';
import ICON_SCORE from '@/assets/images/e0586113a5c7e7f6673deef204af033c.png';

/**
 * 积分兑换规则
 */
export function scoreDeductionRuleModel(item: Recordable) {
  const typeMap: Recordable = {
    0: {
      value: 0,
      label: '抵扣下单金额',
      desc: '下单时 {{score}} 积分抵扣 {{money}} 金额。',
      icon: ICON_SCORE,
    },
    1: {
      value: 1,
      label: '兑换成长值',
      desc: '{{score}} 积分兑换 {{money}} 成长值，兑换成功后，可以在个人中心查看。',
      icon: ICON_MONEY,
    },
    2: {
      value: 2,
      label: '兑换成现金',
      desc: '{{score}} 积分兑换 {{money}} 金额，兑换成功后，可以在我的钱包查看。',
      icon: ICON_MONEY,
    },
  };

  const type = typeMap[item.type];
  const pattern = /\{\{(.*?)\}\}/g;

  if (type) {
    item.label = type.label;
    item.desc = type.desc.replace(pattern, (_match: any, p1: string) => item[p1]);
    item.icon = type.icon;
  }

  return item;
}
