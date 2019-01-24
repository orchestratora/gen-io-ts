export interface Type<T> {
  new (...args: any[]): T;
  prototype: T;
}

export type Primitive = boolean | number | string | null | undefined;

export type MapTo<T, V> = { [K in keyof T]: V };

export type MapDeep<T, V> = {
  [K in keyof T]: T[K] extends object ? MapDeep<T[K], V> : MapTo<T[K], V>
};

export interface StringHashMap<T> {
  [key: string]: T;
}
