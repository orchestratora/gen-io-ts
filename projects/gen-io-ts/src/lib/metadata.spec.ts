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
      @Property(new AnyOf('lol', 'd'))
      prop3: string[];
    }
    class MyClass {
      @Property()
      prop4: GG;
    }

    const meta = resolveMetadataOf(MyClass);

    expect(meta).toBeTruthy();
    expect(meta).toEqual({
      prop4: {
        prop1: Boolean,
        prop2: Number,
        prop3: ['lol', 'd'],
      },
    } as any);
  });
});
