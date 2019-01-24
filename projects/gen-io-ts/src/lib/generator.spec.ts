import * as t from 'io-ts';
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

  it('should pass validation on non required props', () => {
    class MyClass {
      @Property()
      prop1: string;
      @Property()
      prop2: number;
    }

    const myClassType = genIoType(MyClass);
    const res = myClassType.decode({});

    expect(() => ThrowReporter.report(res)).not.toThrow();
  });

  it('should fail validation on required props', () => {
    class MyClass {
      @Property({ isRequired: true })
      prop1: string;
      @Property()
      prop2: number;
    }

    const myClassType = genIoType(MyClass);
    const res = myClassType.decode({});

    expect(() => ThrowReporter.report(res)).toThrow();
  });

  describe('custom type', () => {
    it('should override default type', () => {
      class MyClass {
        @Property({ type: Boolean })
        prop1: string;
      }

      const myClassType = genIoType(MyClass);
      const valid = myClassType.decode({ prop1: true });
      const invalid = myClassType.decode({ prop1: 'why?' });

      expect(() => ThrowReporter.report(valid)).not.toThrow();
      expect(() => ThrowReporter.report(invalid)).toThrow();
    });
  });

  describe('custom type factory', () => {
    it('should override default type', () => {
      class MyClass {
        @Property({ typeFactory: () => t.boolean })
        prop1: string;
      }

      const myClassType = genIoType(MyClass);
      const valid = myClassType.decode({ prop1: true });
      const invalid = myClassType.decode({ prop1: 'why?' });

      expect(() => ThrowReporter.report(valid)).not.toThrow();
      expect(() => ThrowReporter.report(invalid)).toThrow();
    });

    it('should enhance default type', () => {
      class MyClass {
        @Property({ typeFactory: type => t.refinement(type, str => str.length > 1, 'NotEmpty') })
        prop1: string;
      }

      const myClassType = genIoType(MyClass);
      const valid = myClassType.decode({ prop1: 'good' });
      const invalid = myClassType.decode({ prop1: '' });

      expect(() => ThrowReporter.report(valid)).not.toThrow();
      expect(() => ThrowReporter.report(invalid)).toThrow();
    });
  });
});
