import { MapDeep } from './types';

export abstract class RuntimeType {}

export class TypeOf<T> extends RuntimeType {
  constructor(public type: T) {
    super();
  }
}

export class AnyOf<T> extends TypeOf<T[]> {
  constructor(...types: T[]) {
    super(types);
  }
}

export class ArrayOf<T> extends AnyOf<T> {
  constructor(type: T) {
    super(type);
  }
}

export type AsRuntimeType<T> = MapDeep<T, RuntimeType>;
