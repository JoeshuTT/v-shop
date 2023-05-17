import { isDef } from './is';

/**
 * 保留小数点（原生toFixed）
 */
export function decimalFormat(n: number | string, digits = 2) {
  const num = Number(n);
  if (Number.isNaN(num)) {
    return '';
  }

  return num.toFixed(digits);
}

/**
 * 数值显示占位
 */
export function countPair(n: number | undefined, digits = 2, placeholder = '--') {
  return isDef(n) ? (n >= 0 ? Number(n).toFixed(digits) : placeholder) : placeholder;
}

/**
 * 手机号码显示加密
 */
export function mobileShow(n: string) {
  return n.replace(n.substring(3, 7), '****');
}

/**
 * 商品价格显示
 */
export function priceIntegerFormat(min: number, max: number) {
  if (max && min !== max) {
    return `${decimalFormat(min)}-${decimalFormat(max)}`;
  }

  return decimalFormat(min);
}
