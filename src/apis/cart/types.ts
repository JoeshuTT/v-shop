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
  number: Number;
  price: Number;
  score: Number;
  shopList: Recordable[];
}
