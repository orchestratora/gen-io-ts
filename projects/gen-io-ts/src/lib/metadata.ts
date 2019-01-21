import { AnyOf, AsRuntimeType, RuntimeType, TypeOf } from './runtime-types';
import { Type } from './types';
import { isBuiltinType, isPrimitive } from './util';

const Reflect = (window as any).Reflect;

const propMetaKey = '__PROPERTY_META__';

export function resolveMetadataOf<T>(type: Type<T>): T {
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

  const metadata = getPropertyTypes(obj);

  if (!metadata) {
    return Object;
  }

  if (typeof metadata === 'object') {
    Object.keys(metadata).forEach(key => (metadata[key] = resolveMetaRecursive(metadata[key])));
  }

  return metadata;
}

export function setPropertyType(target: Object, prop: string | symbol, customType?: RuntimeType) {
  if (!target[propMetaKey]) {
    Object.defineProperty(target, propMetaKey, {
      configurable: true,
      enumerable: false,
      value: Object.create(null),
    });
  }

  const types = target[propMetaKey];
  types[prop] = customType || new TypeOf(readPropType(target, prop));
}

export function getPropertyTypes<T>(target: Type<T>): AsRuntimeType<T> {
  return target.prototype[propMetaKey];
}

export function readPropType(target: Object, prop: string | symbol): any {
  return Reflect.getMetadata('design:type', target, prop);
}
