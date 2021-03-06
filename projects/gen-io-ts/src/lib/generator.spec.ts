import * as t from 'io-ts';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

import { Property } from './property';
import { genIoType } from './generator';
import { arrayOf, anyOf } from './type-factories';

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

    it('should override with proper array type via `arrayOf()`', () => {
      class MyClass {
        @Property({ type: arrayOf(String) })
        prop1: string[];
      }

      const myClassType = genIoType(MyClass);
      const valid = myClassType.decode({ prop1: ['a', 'b'] });
      const invalid = myClassType.decode({ prop1: 'why?' });

      expect(() => ThrowReporter.report(valid)).not.toThrow();
      expect(() => ThrowReporter.report(invalid)).toThrow();
    });

    it('should override with proper union type via `anyOf()`', () => {
      class MyClass {
        @Property({ type: anyOf(String, Number) })
        prop1: string | number;
      }

      const myClassType = genIoType(MyClass);
      const valid = myClassType.decode({ prop1: 'a' });
      const valid2 = myClassType.decode({ prop1: 1 });
      const invalid = myClassType.decode({ prop1: true });

      expect(() => ThrowReporter.report(valid)).not.toThrow();
      expect(() => ThrowReporter.report(valid2)).not.toThrow();
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
        @Property({
          typeFactory: type =>
            t.refinement(type, str => str.length > 1, 'NotEmpty'),
        })
        prop1: string;
      }

      const myClassType = genIoType(MyClass);
      const valid = myClassType.decode({ prop1: 'good' });
      const invalid = myClassType.decode({ prop1: '' });

      expect(() => ThrowReporter.report(valid)).not.toThrow();
      expect(() => ThrowReporter.report(invalid)).toThrow();
    });

    it('should respect required flag on custom type', () => {
      class NonRequiredClass {
        @Property({ typeFactory: () => t.boolean, isRequired: false })
        prop1: string;
      }

      class RequiredClass {
        @Property({ typeFactory: () => t.boolean, isRequired: true })
        prop1: string;
      }

      const nonRequiredType = genIoType(NonRequiredClass);
      const requiredType = genIoType(RequiredClass);

      const prop1Valid = nonRequiredType.decode({ prop1: true });
      const prop1Valid2 = nonRequiredType.decode({});
      const prop1Invalid = nonRequiredType.decode({ prop1: 'no' });

      const prop2Valid = requiredType.decode({ prop1: true });
      const prop2Invalid = requiredType.decode({});
      const prop2Invalid2 = requiredType.decode({ prop1: 'no' });

      expect(() => ThrowReporter.report(prop1Valid)).not.toThrow();
      expect(() => ThrowReporter.report(prop1Valid2)).not.toThrow();
      expect(() => ThrowReporter.report(prop1Invalid)).toThrow();

      expect(() => ThrowReporter.report(prop2Valid)).not.toThrow();
      expect(() => ThrowReporter.report(prop2Invalid)).toThrow();
      expect(() => ThrowReporter.report(prop2Invalid2)).toThrow();
    });
  });
});
