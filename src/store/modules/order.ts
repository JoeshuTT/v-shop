import { defineStore } from 'pinia';
import { store } from '@/store';
import storage from 'good-storage';
import { showLoadingToast, showConfirmDialog } from 'vant';
import { router } from '@/router';
import API_ORDER from '@/apis/order';

export interface OrderState {
  tradeGoods: NonNullable<ITradeGoods>;
}

export const useOrderStore = defineStore({
  id: 'order',
  state: (): OrderState => ({
    tradeGoods: storage.get('tradeGoods', {}),
  }),
  getters: {
    getTradeGoods: (state): ITradeGoods => state.tradeGoods,
  },
  actions: {
    /**
     * 下单结算商品信息汇总
     */
    async setTradeGoods(payload: Recordable = {}) {
      const { origin = 'buy', list = [], goOrder = true } = payload;
      let goodList: ITradeGoodItem[] = [];

      if (origin === 'cart') {
        list.forEach((v: any) => {
          goodList.push({
            goodsId: v.goodsId,
            name: v.name,
            number: v.number,
            pic: v.pic,
            price: v.price,
            logisticsId: v.logisticsId,
            propertyList: v.sku?.length
              ? v.sku.map((v: any) => ({
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

      const tradeGoods = {
        origin,
        list: goodList,
      };
      this.tradeGoods = tradeGoods;
      storage.set('tradeGoods', tradeGoods);

      goOrder && router.push('/order/submit');
    },
    /**
     * 删除订单
     * @description 只有已关闭、待支付、待评价、已评价的订单才可以删除
     */
    async deleteOrder(payload: Recordable = {}) {
      const { orderId } = payload;

      await showConfirmDialog({
        title: '确定删除订单？',
        message: '删除订单后无法恢复，无法处理您的售后问题，请慎重考虑。',
        cancelButtonText: '在考虑下',
        confirmButtonText: '删除',
      });

      showLoadingToast({
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
    async closeOrder(payload: Recordable = {}) {
      const { orderId } = payload;

      await showConfirmDialog({
        title: '确定取消订单？',
        message: '订单还未付款,确定要取消吗？',
        cancelButtonText: '在考虑下',
        confirmButtonText: '取消订单',
      });

      showLoadingToast({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      await API_ORDER.orderClose({ orderId });
    },
  },
});

export function useOrderStoreWithOut() {
  return useOrderStore(store);
}

export interface ITradeGoodItem {
  goodsId: string;
  name: string;
  number: number;
  pic: string;
  price: number;
  logisticsId: number;
  propertyList: Array<any>;
}
export interface ITradeGoods {
  origin: string;
  list: ITradeGoodItem[];
}
