import * as metadata from './metadata';
import { Property } from './property';

describe('@Property() property decorator', () => {
  it('should return function that calls `setPropertyType()` with target, prop and options', () => {
    const setPropertyType = fixedSpyOn(metadata, 'setPropertyType');
    const fn = Property('options' as any);

    expect(fn).toEqual(jasmine.any(Function));

    fn('target', 'prop');

    expect(setPropertyType).toHaveBeenCalledWith('target', 'prop', 'options');
  });
});

function fixedSpyOn<T>(target: T, prop: keyof T): jasmine.Spy {
  const spy = jasmine.createSpy(`${prop}Spy`);
  spyOnProperty(target, prop).and.returnValue(spy);
  return spy;
}
