import { MapDeep } from './types';

export type AsRuntimeType<T> = MapDeep<T, RuntimeType>;

export abstract class RuntimeType {}

/**
 * @internal
 */
export class TypeOf<T> extends RuntimeType {
  constructor(public type: T) {
    super();
  }
}

/**
 * @internal
 */
export class AnyOf<T> extends TypeOf<T[]> {
  constructor(...types: T[]) {
    super(types);
  }
}

/**
 * @internal
 */
export class ArrayOf<T> extends AnyOf<T> {
  constructor(type: T) {
    super(type);
  }
}
