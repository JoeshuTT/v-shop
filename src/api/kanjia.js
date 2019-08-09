import request from '@/common/request'

export function kanjiaList(data) {
  return request.post('/shop/goods/kanjia/list', data)
}

export function kanjiaSet(data) {
  return request.get('/shop/goods/kanjia/set', data)
}
