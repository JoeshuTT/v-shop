import { defRequest } from '@/utils/http/request';

/**
 * Banner列表
 */
export function bannerList(data?: Recordable) {
  return defRequest({
    url: `/banner/list`,
    method: 'get',
    params: data,
  });
}

/**
 * 获取所有的Banner类型
 */
export function bannerTypes(data?: Recordable) {
  return defRequest({
    url: `/banner/types`,
    method: 'get',
    params: data,
  });
}

export default {
  bannerList,
  bannerTypes,
};
