export interface ISku {
  goodsId: number;
  price: number;
  stock: number;
  goodInfo: Recordable;
  propList: Recordable[];
  skuList: Recordable[];
}

export interface IInitialSku {
  selectedNum: number;
  selectedProps: Recordable;
  selectedPropList: ISelectedPropItem[];
}

export interface ISelectedPropItem {
  id: number;
  name: string;
  childId: number;
  childName: string;
  propIds: string;
}

export interface ISelectedSkuComb {
  price: number;
  maxPrice: number;
  stock: number;
}
