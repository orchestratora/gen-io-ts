export interface RequiredReflectApi {
  getMetadata(type: string, obj: Object, prop: string | symbol): any;
}

let _reflectImpl: RequiredReflectApi;

export function provideReflect(reflectImpl: RequiredReflectApi) {
  _reflectImpl = reflectImpl;
}

/** @internal */
export function getReflect(): RequiredReflectApi {
  const reflect = _reflectImpl || (global as any).Reflect;

  if (!reflect) {
    throw new Error(
      'Reflect API is not available and was not provided! ' +
        'Please import polyfill or use `provideReflect()` to manually provide Reflect API',
    );
  }

  return reflect;
}
