import { isObject } from './util';

describe('util', () => {
  it('isObject: should return correct validation for objects', () => {
    const testThis: any[] = [
      { value: '', expect: false },
      { value: [], expect: false },
      { value: { foo: 'bar' }, expect: true },
    ];

    testThis.forEach(test => expect(isObject(test.value)).toBe(test.expect));
  });
});
