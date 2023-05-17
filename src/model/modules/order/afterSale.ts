/**
 * 售后服务标题
 * @param {*} data
 */
export function getAfterSaleTitle(data: string) {
  const start = '收货后结算';
  const separator = ' · ';

  if (data.length) {
    if (data.includes('1') || (data.includes('0') && data.includes('2'))) {
      return `${start}${separator}支持退款退货`;
    }

    if (data.includes('0')) {
      return `${start}${separator}支持退款`;
    }

    if (data.includes('2')) {
      return `${start}${separator}支持退货`;
    }
  } else {
    return `${start}${separator}不支持售后退换服务`;
  }

  return '';
}

/**
 * 售后服务
 */
export const afterSale = {
  0: {
    value: 0,
    label: '仅退款',
  },
  1: {
    value: 1,
    label: '退款退货',
  },
  2: {
    value: 2,
    label: '退货',
  },
};

/**
 * 商品售后服务
 */
export function orderAfterSaleListModel(orderList: Recordable[], goodsMap: { [key: string]: Recordable[] }) {
  const array: Recordable[] = [];

  orderList.forEach((item) => {
    const goodList = goodsMap[item.id] || [];

    goodList.forEach((v) => {
      array.push({
        ...v,
        orderInfo: item,
      });
    });
  });

  return array;
}
