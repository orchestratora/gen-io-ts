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
