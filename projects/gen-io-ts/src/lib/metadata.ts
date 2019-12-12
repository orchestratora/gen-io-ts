import * as t from 'io-ts';

import { getReflect } from './reflect';
import { AnyOf, AsRuntimeType, RuntimeType, TypeOf } from './runtime-types';
import { typeOf } from './type-factories';
import { MapTo, StringHashMap, Type } from './types';
import { chainFns, identity, isBuiltinType, isPrimitive } from './util';

const propMetaKey = '__PROPERTY_META__';

export type TypeFactory<T> = (type: t.Type<T>) => t.Type<T>;

export interface TypeMetadata<T extends RuntimeType> {
  type?: T;
  typeFactory?: TypeFactory<T>;
  isRequired?: boolean;
}

export class ResolvedTypeMetadata<T> implements TypeMetadata<T> {
  meta: AsRuntimeType<T> = {} as any;

  static isResolvedMetadata(obj: any): obj is ResolvedTypeMetadata<any> {
    return !!obj && obj instanceof ResolvedTypeMetadata;
  }

  constructor(
    public type: T,
    public isRequired = false,
    public typeFactory: TypeFactory<T> = identity,
  ) {}
}

/**
 * Resolves full metadata on `type`
 * @internal
 */
export function resolveMetadataOf<T>(
  type: Type<T>,
): MapTo<T, ResolvedTypeMetadata<T>> {
  return resolveMetaRecursive(type);
}

function resolveMetaRecursive(obj: any) {
  if (!obj || isPrimitive(obj) || isBuiltinType(obj)) {
    return obj;
  }

  if (obj instanceof AnyOf) {
    return obj.type.map(resolveMetaRecursive);
  }

  if (obj instanceof TypeOf) {
    return resolveMetaRecursive(obj.type);
  }

  const metaInfo = getPropertyTypes(obj);

  if (!metaInfo) {
    return Object;
  }

  if (typeof metaInfo === 'object') {
    Object.keys(metaInfo).forEach(key => {
      const meta = metaInfo[key];
      const metadata = new ResolvedTypeMetadata(
        meta.type,
        meta.isRequired,
        meta.typeFactory,
      );
      metadata.meta = resolveMetaRecursive(meta.type);
      metaInfo[key] = metadata;
    });
  }

  return metaInfo;
}

export function setPropertyType(
  target: Object,
  prop: string | symbol,
  options: TypeMetadata<any> = {},
) {
  if (!target[propMetaKey]) {
    Object.defineProperty(target, propMetaKey, {
      configurable: true,
      enumerable: false,
      value: Object.create(null),
    });
  }

  const types = target[propMetaKey];

  const type = options.type || typeOf(readPropType(target, prop));

  types[prop] = mergePropertyMeta(types[prop], { ...options, type });
}

export function getPropertyTypes<T>(
  target: Type<T>,
): StringHashMap<TypeMetadata<T>> {
  return target.prototype[propMetaKey];
}

export function readPropType(target: Object, prop: string | symbol): any {
  return getReflect().getMetadata('design:type', target, prop);
}

export function mergePropertyMeta<T>(
  meta1: TypeMetadata<T> = {},
  meta2: TypeMetadata<T> = {},
): TypeMetadata<T> {
  return {
    ...meta1,
    ...meta2,
    typeFactory: chainFns(meta1.typeFactory, meta2.typeFactory),
  };
}
