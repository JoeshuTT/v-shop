import { request } from '@/utils/request';

/**
 * 抢占秒杀名额
 */
export function goodsSeckillGrab(data?: Recordable) {
  return request({
    url: `/goods/seckill/grab`,
    method: 'post',
    data,
  });
}

/**
 * 商品浏览足迹（历史记录）
 */
export function goodsVisitLog(data?: Recordable) {
  return request({
    url: `/goods/visitLog`,
    method: 'post',
    data,
  });
}

/**
 * 添加浏览足迹
 */
export function goodsVisitLogAdd(data?: Recordable) {
  return request({
    url: `/goods/visitLog/add`,
    method: 'post',
    data,
  });
}

/**
 * 清除所有足迹数据
 */
export function goodsVisitLogClear(data?: Recordable) {
  return request({
    url: `/goods/visitLog/clear`,
    method: 'post',
    data,
  });
}

/**
 * 删除商品足迹
 */
export function goodsVisitLogDelete(data?: Recordable) {
  return request({
    url: `/goods/visitLog/delete`,
    method: 'post',
    data,
  });
}

/**
 * 品牌详情
 */
export function goodsBrandDetail(data?: Recordable) {
  return request({
    url: `/shop/goods/brand/detail`,
    method: 'get',
    params: data,
  });
}

/**
 * 添加品牌收藏
 */
export function goodsBrandFavAdd(data?: Recordable) {
  return request({
    url: `/shop/goods/brand/fav/add`,
    method: 'post',
    data,
  });
}

/**
 * 检测是否已收藏
 */
export function goodsBrandFavCheck(data?: Recordable) {
  return request({
    url: `/shop/goods/brand/fav/check`,
    method: 'get',
    params: data,
  });
}

/**
 * 删除品牌收藏
 */
export function goodsBrandFavDelete(data?: Recordable) {
  return request({
    url: `/shop/goods/brand/fav/delete`,
    method: 'post',
    data,
  });
}

/**
 * 品牌收藏列表
 */
export function goodsBrandFavList(data?: Recordable) {
  return request({
    url: `/shop/goods/brand/fav/list`,
    method: 'post',
    data,
  });
}

/**
 * 品牌列表
 */
export function goodsBrandList(data?: Recordable) {
  return request({
    url: `/shop/goods/brand/list`,
    method: 'post',
    data,
  });
}

/**
 * 商品类别
 */
export function goodsCategoryAll(data?: Recordable) {
  return request({
    url: `/shop/goods/category/all`,
    method: 'get',
    params: data,
  });
}

/**
 * 分类详情
 */
export function goodsCategoryInfo(data?: Recordable) {
  return request({
    url: `/shop/goods/category/info`,
    method: 'get',
    params: data,
  });
}

/**
 * 删除自己发布的商品
 */
export function goodsDel(data?: Recordable) {
  return request({
    url: `/shop/goods/del`,
    method: 'post',
    data,
  });
}

/**
 * 商品详情
 */
export function goodsDetail(data?: Recordable) {
  return request({
    url: `/shop/goods/detail`,
    method: 'get',
    params: data,
  });
}

/**
 * 添加商品收藏
 */
export function goodsFavAdd(data?: Recordable) {
  return request({
    url: `/shop/goods/fav/add`,
    method: 'post',
    data,
  });
}

/**
 * 检测是否已收藏
 */
export function goodsFavCheck(data?: Recordable) {
  return request({
    url: `/shop/goods/fav/check`,
    method: 'get',
    params: data,
  });
}

/**
 * 删除商品收藏
 */
export function goodsFavDelete(data?: Recordable) {
  return request({
    url: `/shop/goods/fav/delete`,
    method: 'post',
    data,
  });
}

/**
 * 商品收藏列表
 */
export function goodsFavList(data?: Recordable) {
  return request({
    url: `/shop/goods/fav/list`,
    method: 'post',
    data,
  });
}

/**
 * 读取商品的可选配件
 */
export function goodsGoodsAddition(data?: Recordable) {
  return request({
    url: `/shop/goods/goodsAddition`,
    method: 'get',
    params: data,
  });
}

/**
 * 删除商品历史购买记录
 */
export function goodsHisDelete(data?: Recordable) {
  return request({
    url: `/shop/goods/his/delete`,
    method: 'post',
    data,
  });
}

/**
 * 获取购买过的商品列表
 */
export function goodsHisList(data?: Recordable) {
  return request({
    url: `/shop/goods/his/list`,
    method: 'post',
    data,
  });
}

/**
 * 读取商品的限购设置列表
 */
export function goodsLimitation(data?: Recordable) {
  return request({
    url: `/shop/goods/limitation`,
    method: 'get',
    params: data,
  });
}

/**
 * 商品列表
 */
export function goodsList(data?: Recordable) {
  return request({
    url: `/shop/goods/list/v2`,
    method: 'post',
    data,
  });
}

/**
 * 获取商品价格
 */
export function goodsPrice(data?: Recordable) {
  return request({
    url: `/shop/goods/price`,
    method: 'post',
    data,
  });
}

/**
 * 读取商品的按天定价数据列表
 */
export function goodsPriceDay(data?: Recordable) {
  return request({
    url: `/shop/goods/price/day`,
    method: 'get',
    params: data,
  });
}

/**
 * 获取商品的会员折扣
 */
export function goodsRebate(data?: Recordable) {
  return request({
    url: `/shop/goods/rebate/v2`,
    method: 'get',
    params: data,
  });
}

/**
 * 获取商品评价列表
 */
export function goodsReputation(data?: Recordable) {
  return request({
    url: `/shop/goods/reputation/v2`,
    method: 'post',
    data,
  });
}

export default {
  goodsSeckillGrab,
  goodsVisitLog,
  goodsVisitLogAdd,
  goodsVisitLogClear,
  goodsVisitLogDelete,
  goodsBrandDetail,
  goodsBrandFavAdd,
  goodsBrandFavCheck,
  goodsBrandFavDelete,
  goodsBrandFavList,
  goodsBrandList,
  goodsCategoryAll,
  goodsCategoryInfo,
  goodsDel,
  goodsDetail,
  goodsFavAdd,
  goodsFavCheck,
  goodsFavDelete,
  goodsFavList,
  goodsGoodsAddition,
  goodsHisDelete,
  goodsHisList,
  goodsLimitation,
  goodsList,
  goodsPrice,
  goodsPriceDay,
  goodsRebate,
  goodsReputation,
};
