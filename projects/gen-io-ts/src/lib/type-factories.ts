import { AnyOf, ArrayOf, TypeOf } from './runtime-types';

/**
 * Create instance of {@link TypeOf}
 */
export function typeOf<T>(type: T) {
  return new TypeOf(type);
}

/**
 * Create instance of {@link AnyOf}
 */
export function anyOf<T>(...types: T[]) {
  return new AnyOf(types);
}

/**
 * Create instance of {@link ArrayOf}
 */
export function arrayOf<T>(type: T) {
  return new ArrayOf(type);
}
