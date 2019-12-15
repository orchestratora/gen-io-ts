import { getReflect, provideReflect } from './reflect';

describe('Reflect Provider', () => {
  let originalReflect: any;

  beforeEach(() => {
    originalReflect = (global as any).Reflect; // Remember global Reflect API
  });

  afterEach(() => {
    (global as any).Reflect = originalReflect; // Reset global Reflect API
    provideReflect(undefined); // Reset custom Reflect API
  });

  it('should return by default `global.Reflect` object', () => {
    const reflect = ((global as any).Reflect = 'mock-reflect');

    expect(getReflect()).toBe(reflect as any);
  });

  it('should return custom object passed by `provideReflect()`', () => {
    const reflect = 'custom-reflect' as any;

    provideReflect(reflect);

    expect(getReflect()).toBe(reflect);
  });

  it('should throw if no reflect is available in global and not provided', () => {
    (global as any).Reflect = undefined;

    expect(() => getReflect()).toThrow();
  });
});
