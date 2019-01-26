import { Property } from './property';
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

    it('should call `typeFactory` in order with type', () => {
      const factory1 = jasmine.createSpy('factory1').and.returnValue('t1');
      const factory2 = jasmine.createSpy('factory2').and.returnValue('t2');

      class MyClass {
        @Property()
        @Property({ typeFactory: factory1 })
        @Property()
        @Property({ typeFactory: factory2 })
        @Property()
        prop1: string;
      }

      const meta = resolveMetadataOf(MyClass);

      expect(meta).toBeTruthy();
      expect(meta.prop1.typeFactory).toEqual(jasmine.any(Function));

      const res = meta.prop1.typeFactory('t' as any);

      expect(factory2).toHaveBeenCalledWith('t');
      expect(factory1).toHaveBeenCalledWith('t2');
      expect(res).toBe('t1' as any);
    });
  });
});
