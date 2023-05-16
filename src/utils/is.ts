const toString = Object.prototype.toString;

export function isDef<T = unknown>(val?: T): val is T {
  return val !== undefined && val !== null;
}

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

export function isObject(val: any): val is Record<string, unknown> {
  return val !== null && is(val, 'Object');
}

export function isArray(val: any): val is any[] {
  return val && Array.isArray(val);
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}
