import { Property } from './decorators';
import { resolveMetadataOf } from './metadata';
import { AnyOf } from './runtime-types';

describe('resolveMetadataOf() function', () => {
  it('should return resolved object with types', () => {
    class GG {
      @Property()
      prop1: boolean;
      @Property()
      prop2: number;
      @Property({ type: new AnyOf('lol', 'd') })
      prop3: string[];
    }
    class MyClass {
      @Property()
      prop4: GG;
    }

    const meta = resolveMetadataOf(MyClass);

    expect(meta).toBeTruthy();
    expect(meta).toEqual({
      prop4: jasmine.objectContaining({
        meta: {
          prop1: jasmine.objectContaining({ meta: Boolean }),
          prop2: jasmine.objectContaining({ meta: Number }),
          prop3: jasmine.objectContaining({ meta: ['lol', 'd'] }),
        },
      }),
    } as any);
  });

  describe('multiple @Property', () => {
    it('should merge normal properties', () => {
      class MyClass {
        @Property({ type: Boolean })
        @Property({ isRequired: true })
        @Property({ isRequired: false })
        @Property()
        prop1: string;
      }

      const meta = resolveMetadataOf(MyClass);

      expect(meta).toBeTruthy();
      expect(meta).toEqual({
        prop1: jasmine.objectContaining({
          isRequired: true,
          meta: Boolean,
        }),
      } as any);
    });
  });
});
