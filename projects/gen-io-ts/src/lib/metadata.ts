import { AnyOf, AsRuntimeType, RuntimeType, TypeOf } from './runtime-types';
import { StringHashMap, Type } from './types';
import { isBuiltinType, isPrimitive } from './util';

const Reflect = (window as any).Reflect;

const propMetaKey = '__PROPERTY_META__';

export interface TypeMetadata<T extends RuntimeType> {
  type?: T;
  isRequired?: boolean;
}

export class ResolvedTypeMetadata<T> implements TypeMetadata<T> {
  static isResolvedMetadata(obj: any): obj is ResolvedTypeMetadata<any> {
    return !!obj && obj instanceof ResolvedTypeMetadata;
  }

  meta: AsRuntimeType<T> = {} as any;
  constructor(public type: T, public isRequired = false) {}
}

export function resolveMetadataOf<T>(type: Type<T>): StringHashMap<ResolvedTypeMetadata<T>> {
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
  console.log(metaInfo);

  if (!metaInfo) {
    return Object;
  }

  if (typeof metaInfo === 'object') {
    Object.keys(metaInfo).forEach(key => {
      const meta = metaInfo[key];
      const metadata = new ResolvedTypeMetadata(meta.type, meta.isRequired);
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

  const type = options.type || new TypeOf(readPropType(target, prop));

  types[prop] = { ...options, type };
}

export function getPropertyTypes<T>(target: Type<T>): StringHashMap<TypeMetadata<T>> {
  return target.prototype[propMetaKey];
}

export function readPropType(target: Object, prop: string | symbol): any {
  return Reflect.getMetadata('design:type', target, prop);
}
