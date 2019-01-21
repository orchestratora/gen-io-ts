import * as t from 'io-ts';

import { resolveMetadataOf } from './metadata';
import { Primitive, Type } from './types';
import { isBuiltinType, isObject, isPrimitive } from './util';

export function genIoType<T>(type: Type<T>): t.Type<T> {
  const metadata = resolveMetadataOf(type);
  return genTypeFor(metadata, type.name);
}

function genTypeFor(obj: any, name?: string): t.Type<any> {
  if (isPrimitive(obj)) {
    return genLiteralType(obj, name);
  }

  if (isBuiltinType(obj)) {
    return genBuiltinType(obj, name);
  }

  if (obj === Array) {
    return t.array(t.any as any, name);
  }

  if (obj === Object) {
    return t.any;
  }

  if (Array.isArray(obj)) {
    return genArrayType(obj, name);
  }

  if (isObject(obj)) {
    return genObjectType(obj, name);
  }
}

function genObjectType<T extends Object>(obj: T, name?: string): t.Type<any> {
  const typeObj = Object.keys(obj).reduce(
    (o, key) => ({ ...o, [key]: genTypeFor(obj[key], key) }),
    {},
  );
  return t.type(typeObj, name);
}

function genArrayType<T extends any[]>(arr: T[], name?: string): t.Type<any> {
  const types = arr.map((el, i) => genTypeFor(el, i.toString()));
  return t.union(types as any, name);
}

function genLiteralType<T extends Primitive>(val: T, name?: string) {
  if (val === null || val === undefined) {
    return t.any;
  }

  return t.literal(val);
}

function genBuiltinType(type: Function, name?: string) {
  switch (type) {
    case Boolean:
      return t.boolean;
    case Number:
      return t.number;
    case String:
    case Symbol:
      return t.string;
    case Function:
      return t.Function;
    case Array:
      return t.array(t.any, name);
    case Object:
      return t.any;
    default:
      return t.any;
  }
}
