export interface shoppingCartAddParams {
  goodsId: number;
  number: number;
  addition?: string;
  sku?: string;
  type?: string;
}
export interface shoppingCartResult {
  goodsStatus: Recordable[];
  items: Recordable[];
  number: number;
  price: number;
  score: number;
  shopList: Recordable[];
}
