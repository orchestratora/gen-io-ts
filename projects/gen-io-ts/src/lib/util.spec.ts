import {
  isObject,
  isPrimitive,
  isFunction,
  isBuiltinType,
  identity,
  chainFns,
} from './util';

describe('util', () => {
  describe('isObject() function', () => {
    it('should return correct validation for objects', () => {
      const testThis: any[] = [
        { value: '', expect: false },
        { value: [], expect: false },
        { value: { foo: 'bar' }, expect: true },
      ];

      testThis.forEach(test => expect(isObject(test.value)).toBe(test.expect));
    });
  });

  describe('isPrimitive() function', () => {
    it('should return `true` for all primitive types', () => {
      const primitives = [
        false,
        true,
        1,
        0,
        -1,
        'ok',
        '',
        1.2,
        null,
        undefined,
        Symbol('bla'),
      ];

      primitives.forEach(primitive =>
        expect(isPrimitive(primitive)).toBe(
          true,
          `Expected ${String(primitive)} to be primitive`,
        ),
      );
    });

    it('should return `false` for non primitive types', () => {
      const nonPrimitives = [{}, [], () => null];

      nonPrimitives.forEach(nonPrimitive =>
        expect(isPrimitive(nonPrimitive)).toBe(
          false,
          `Expected ${String(nonPrimitive)} to be NON primitive`,
        ),
      );
    });
  });

  describe('isFunction() function', () => {
    it('should return `true` for functions', () => {
      const functions = [function() {}, () => null];

      functions.forEach(fn =>
        expect(isFunction(fn)).toBe(
          true,
          `Expected ${String(fn)} to be function`,
        ),
      );
    });

    it('should return `false` for non functions', () => {
      const nonFunctions = [true, null, undefined, {}, [], 'a', 1, Symbol('b')];

      nonFunctions.forEach(nonFn =>
        expect(isFunction(nonFn)).toBe(
          false,
          `Expected ${String(nonFn)} to be NON function`,
        ),
      );
    });
  });

  describe('isObject() function', () => {
    it('should return `true` for all objects', () => {
      const objects = [
        {},
        Object.create(null),
        new Object(),
        new Number(0),
        new String('a'),
        new Boolean(false),
      ];

      objects.forEach(obj =>
        expect(isObject(obj)).toBe(
          true,
          // This will fail test case as `Object.create(null)`
          // cannot be converted to string
          // `Expected ${String(obj)} to be object`,
        ),
      );
    });

    it('should return `false` for all non objects', () => {
      const nonObjects = [[], true, 1, 0, 'a', Symbol('b'), null, undefined];

      nonObjects.forEach(nonObj =>
        expect(isObject(nonObj)).toBe(
          false,
          `Expected ${String(nonObj)} to be NON object`,
        ),
      );
    });
  });

  describe('isBuiltinType() function', () => {
    it('should return `true` for all built-in types', () => {
      const builtIns = [
        String,
        Number,
        Boolean,
        Array,
        Object,
        Symbol,
        Function,
      ];

      builtIns.forEach(builtIn =>
        expect(isBuiltinType(builtIn)).toBe(
          true,
          `Expected ${builtIn} to be built-in`,
        ),
      );
    });

    it('should return `false` for all NON built-in types', () => {
      class MyType {}
      const nonBuiltIns = [null, undefined, MyType, () => null, class {}];

      nonBuiltIns.forEach(nonBuiltIn =>
        expect(isBuiltinType(nonBuiltIn)).toBe(
          false,
          `Expected ${nonBuiltIn} to be NON built-in`,
        ),
      );
    });
  });

  describe('identity() function', () => {
    it('should return passed in argument', () => {
      const arg = {};
      expect(identity(arg)).toBe(arg);
    });
  });

  describe('chainFns() function', () => {
    it('should return function that will call other 2 chained in order', () => {
      const fn1 = jasmine.createSpy('fn1').and.returnValue('val1');
      const fn2 = jasmine.createSpy('fn2').and.returnValue('val2');

      const chainedFn = chainFns(fn1, fn2);

      expect(chainedFn).toEqual(jasmine.any(Function));

      const res = chainedFn('args');

      expect(fn1).toHaveBeenCalledWith('args');
      expect(fn2).toHaveBeenCalledWith('val1');
      expect(res).toBe('val2');
    });
  });
});
