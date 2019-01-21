import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

import { Property } from './decorators';
import { genIoType } from './generator';

describe('genIoType() function', () => {
  it('should not validate non-annotated class', () => {
    class MyClass {
      prop1: string;
      prop2: number;
    }

    const myClassType = genIoType(MyClass);
    const res = myClassType.decode({ lol: true });

    expect(() => ThrowReporter.report(res)).not.toThrowError();
  });

  it('should validate annotated props', () => {
    class MyClass {
      @Property()
      prop1: string;
      @Property()
      prop2: number;
    }

    const myClassType = genIoType(MyClass);
    const res = myClassType.decode({ prop1: 'ok', prop2: 1 });

    expect(() => ThrowReporter.report(res)).not.toThrow();
  });

  it('should fail validation on wrong annotated props', () => {
    class MyClass {
      @Property()
      prop1: string;
      @Property()
      prop2: number;
    }

    const myClassType = genIoType(MyClass);
    const res = myClassType.decode({ prop1: 0, prop2: 'not ok' });

    expect(() => ThrowReporter.report(res)).toThrow();
  });
});
