import request from '@/common/request'

export function api_pingtuanList(data) {
  return request.post('/shop/goods/pingtuan/list/v2', data)
}
