import router from '@/router';
import storage from 'good-storage';
import API_ORDER from '@/apis/order';
import { Toast, Dialog } from 'vant';

export default {
  namespaced: true,
  state: {
    tradeGoods: storage.get('tradeGoods', {}),
  },
  getters: {
    tradeGoods: (state) => state.tradeGoods,
  },
  mutations: {
    setTradeGoods(state, payload) {
      state.tradeGoods = payload;
      storage.set('tradeGoods', payload);
    },
  },
  actions: {
    /**
     * 下单结算商品信息汇总
     */
    async setTradeGoods({ commit }, payload = {}) {
      const { origin = 'buy', list = [], goOrder = true } = payload;
      let goodList = [];
      if (origin === 'cart') {
        list.forEach((v) => {
          goodList.push({
            goodsId: v.goodsId,
            name: v.name,
            number: v.number,
            pic: v.pic,
            price: v.price,
            logisticsId: v.logisticsId,
            propertyList: v.sku?.length
              ? v.sku.map((v) => ({
                  id: v.optionId,
                  name: v.optionName,
                  childId: v.optionValueId,
                  childName: v.optionValueName,
                  propIds: `${v.optionId}:${v.optionValueId}`,
                }))
              : [],
          });
        });
      } else {
        goodList = list;
      }
      commit('setTradeGoods', {
        origin,
        list: goodList,
      });

      goOrder && router.push('/order/submit');
    },
    /**
     * 删除订单
     * @description 只有已关闭、待支付、待评价、已评价的订单才可以删除
     */
    async deleteOrder(_, payload = {}) {
      const { orderId } = payload;

      await Dialog.confirm({
        title: '确定删除订单？',
        message: '删除订单后无法恢复，无法处理您的售后问题，请慎重考虑。',
        cancelButtonText: '在考虑下',
        confirmButtonText: '删除',
      });

      Toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      await API_ORDER.orderDelete({ orderId });
    },
    /**
     * 关闭订单
     * @description 待付款的订单可以关闭
     */
    async closeOrder(_, payload = {}) {
      const { orderId } = payload;

      await Dialog.confirm({
        title: '确定取消订单？',
        message: '订单还未付款,确定要取消吗？',
        cancelButtonText: '在考虑下',
        confirmButtonText: '取消订单',
      });

      Toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      await API_ORDER.orderClose({ orderId });
    },
  },
};
