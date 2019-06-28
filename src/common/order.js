import request from '@/common/request'

const xToken = '4ca2f8d4-edfe-419c-b9f3-0fcc706c91a3'
// 直接标记订单为已付款
export function orderPay(id) {
  return request.post('https://user.api.it120.cc/user/apiExtOrder/pay/offline', { id }, { 'X-Token': xToken })
}
export function orderSuccess(id) {
  return request.post('https://user.api.it120.cc/user/apiExtOrder/success', { id }, { 'X-Token': xToken })
}
// // 模拟支付()))
// this.$toast.loading({
//     mask: true,
//     message: '模拟支付...',
//     duration:0,
//     })
//     const id = res.data.id,amountReal = res.data.amountReal,remark = res.data.remark
//     orderPay(id).then(res=>{
//     if(res.code === 0){
//         this.$toast(res.msg)
//         return;
//     }
//     this.$toast.clear()
//     this.$dialog.confirm({
//         title: '支付成功',
//         message: `实付￥${amountReal}${remark}`,
//         cancelButtonText:'返回首页',
//         confirmButtonText:'查看订单'
//     }).then(() => {
//         this.$router.replace({path:'/order-list'})
//         // on confirm
//     }).catch(() => {
//         // on cancel
//         this.$router.replace({path:'/order-list?status=0'})
//     });