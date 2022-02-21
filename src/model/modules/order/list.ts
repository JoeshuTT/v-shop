import { IGoodsMap } from './typings';

/**
 *  订单列表
 */
export function orderListModel(orderList: Recordable[], goodsMap: IGoodsMap) {
  const array: Recordable[] = [];

  orderList.forEach((item) => {
    const goodList = goodsMap[item.id] || [];

    array.push({
      ...item,
      goodsInfo: goodList.length ? goodList[0] : {},
    });
  });

  return array;
}
