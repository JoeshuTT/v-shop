/**
 *  订单列表
 */
export function orderListModel(orderList, goodsMap) {
  const array = [];

  orderList.forEach((item) => {
    const goodList = goodsMap[item.id] || [];

    array.push({
      ...item,
      goodsInfo: goodList.length ? goodList[0] : {},
    });
  });

  return array;
}
