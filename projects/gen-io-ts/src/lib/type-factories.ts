import { AnyOf, ArrayOf, TypeOf } from './runtime-types';

/**
 * Represents a type in runtime
 */
export function typeOf<T>(type: T) {
  return new TypeOf(type);
}

/**
 * Represents a set of allowed types in runtime
 */
export function anyOf<T>(...types: T[]) {
  return new AnyOf(types);
}

/**
 * Represents array of single type in runtime
 */
export function arrayOf<T>(type: T) {
  return new ArrayOf(type);
}
