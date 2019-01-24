import { MapDeep } from './types';

export type AsRuntimeType<T> = MapDeep<T, RuntimeType>;

export abstract class RuntimeType {}

/**
 * Represents a type in runtime
 */
export class TypeOf<T> extends RuntimeType {
  constructor(public type: T) {
    super();
  }
}

/**
 * Represents a set of allowed types in runtime
 */
export class AnyOf<T> extends TypeOf<T[]> {
  constructor(...types: T[]) {
    super(types);
  }
}

/**
 * Represents array of single type in runtime
 */
export class ArrayOf<T> extends AnyOf<T> {
  constructor(type: T) {
    super(type);
  }
}
