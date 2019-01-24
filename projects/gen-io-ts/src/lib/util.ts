import { Primitive } from './types';

export function isPrimitive(obj: any): obj is Primitive {
  return !obj || obj === null || (typeof obj !== 'object' && typeof obj !== 'function');
}

export function isFunction(obj: any): obj is Function {
  return !!obj && typeof obj === 'function';
}

export function isObject(obj: any): obj is Object {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function isBuiltinType(type: any): boolean {
  return (
    isFunction(type) &&
    (type === String ||
      type === Number ||
      type === Boolean ||
      type === Array ||
      type === Object ||
      type === Symbol ||
      type === Function)
  );
}

export function identity<T>(arg: T): T {
  return arg;
}

export function chainFns<T extends Function>(fn1?: T, fn2?: T): T {
  if (!isFunction(fn1)) {
    return fn2;
  }

  if (!isFunction(fn2)) {
    return fn1;
  }

  return ((...args) => fn2(fn1(...args))) as any;
}
