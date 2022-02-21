// /**
//  * 商品规格
//  * @param {*} basicInfo
//  * @param {*} properties
//  */
// export default function (basicInfo, properties, skuList) {
//   const skuData = {};
//   let propTitle = '';

//   //   // 商品规格sku数据
//   //   const tree = properties.map((item, index) => ({
//   //     k: item.name,
//   //     k_id: item.id,
//   //     v: item.childsCurGoods,
//   //     k_s: 's' + (index + 1),
//   //     count: item.childsCurGoods.length,
//   //   }));

//   //   skuData.goods_info = {
//   //     title: basicInfo.name,
//   //     picture: basicInfo.pic,
//   //   };

//   //   skuData.goods_id = basicInfo.id; // 商品id
//   //   skuData.sku.price = basicInfo.minPrice.toFixed(2); // 默认价格（单位元）
//   //   skuData.sku.stock_num = basicInfo.stores; // 商品总库存
//   //   skuData.sku.tree = tree;

//   //   // 商品无规格
//   //   if (tree.length === 0) {
//   //     propTitle = '';
//   //     skuData.none_sku = true;
//   //     // skuData.collection_id= 2261
//   //     return;
//   //   }

//   //   // 商品多个规格
//   //   propTitle = `选择 ${tree.reduce((acc, item) => acc + ' ' + item.k, '')}`;
//   //   if (tree.length > 0) {
//   //     const calc = descartes(
//   //       Array.prototype.concat.apply(
//   //         [],
//   //         tree.map((item) => [item.v]),
//   //       ),
//   //     );
//   //     skuData.sku.list = calc.map((item) => {
//   //       const obj = {
//   //         price: parseFloat((basicInfo.minPrice * 100).toFixed(2)), // 价格（单位分）
//   //         stock_num: basicInfo.stores, // 当前 sku 组合对应的库存
//   //       };
//   //       if (Array.isArray(item)) {
//   //         // 2种规格以上
//   //         item.forEach((v, i) => {
//   //           obj[`s${i + 1}`] = v.id;
//   //           obj.propertyChildIds = `${obj.propertyChildIds || ''}${v.propertyId}:${v.id},`;
//   //           obj.id = `${obj.id || ''}${v.propertyId}${v.id}`;
//   //         });
//   //         return obj;
//   //       } else {
//   //         // 只有一种规格的情况下
//   //         obj['s1'] = item.id;
//   //         obj.propertyChildIds = `${item.propertyId}:${item.id},`;
//   //         obj.id = `${item.propertyId}${item.id}`;
//   //         return obj;
//   //       }
//   //     });
//   //   }

//   console.log(skuData, propTitle);
//   return {};
// }

// /**
//  * 商品规格SKU组合查询算法（笛卡尔积）
//  * @returns {*}
//  */
// function descartes(array) {
//   if (array.length < 2) return array[0] || [];

//   return [].reduce.call(array, function (col, set) {
//     let res = [];
//     col.forEach(function (c) {
//       set.forEach(function (s) {
//         let t = [].concat(Array.isArray(c) ? c : [c]);
//         t.push(s);
//         res.push(t);
//       });
//     });
//     return res;
//   });
// }
