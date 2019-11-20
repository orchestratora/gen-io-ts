import * as t from 'io-ts';

import { ResolvedTypeMetadata, resolveMetadataOf } from './metadata';
import { Primitive, Type } from './types';
import { isBuiltinType, isObject, isPrimitive } from './util';

/**
 * Required to safely access from `io-ts` reserved exports like `undefined`
 * because of the bug in rollup
 * @see https://github.com/rollup/rollup/issues/2680
 * @internal
 */
function getIoTs<K extends keyof typeof t>(prop: K) {
  return t[prop];
}

/**
 * Generate `io-ts` codec for `type`
 *
 * To validate runtime object call `.validate(...)` on it
 * @see https://github.com/gcanti/io-ts#the-idea - How to use codecs
 */
export function genIoType<T>(type: Type<T>): t.Type<T> {
  const metadata = resolveMetadataOf(type);
  return genTypeFor(metadata, type.name);
}

function genTypeFor(obj: any, name?: string): t.Type<any> {
  const type = ResolvedTypeMetadata.isResolvedMetadata(obj) ? obj.meta : obj;
  const metadata = ResolvedTypeMetadata.isResolvedMetadata(obj) ? obj : null;

  let codec = genCodecType(type, name);

  if (metadata && metadata.typeFactory) {
    codec = metadata.typeFactory(codec);
  }

  if (metadata && !metadata.isRequired) {
    codec = t.union([codec, getIoTs('null'), getIoTs('undefined')]);
  }

  return codec;
}

function genCodecType(type: any, name?: string) {
  if (isPrimitive(type)) {
    return genLiteralType(type, name);
  }

  if (isBuiltinType(type)) {
    return genBuiltinType(type, name);
  }

  if (Array.isArray(type)) {
    return genArrayType(type, name);
  }

  if (isObject(type)) {
    return genObjectType(type, name);
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
  return types.length === 1
    ? t.array(types[0], name)
    : t.union(types as any, name);
}

function genLiteralType<T extends Primitive>(val: T, name?: string) {
  if (val === null || val === undefined) {
    return t.unknown;
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
      return t.array(t.unknown, name);
    case Object:
      return t.unknown;
    default:
      return t.unknown;
  }
}
