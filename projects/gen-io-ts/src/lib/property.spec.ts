import * as metadata from './metadata';
import { Property } from './property';

describe('@Property() property decorator', () => {
  it('should return function that calls `setPropertyType()` with target, prop and options', () => {
    const setPropertyType = spyOn(metadata, 'setPropertyType');
    const options = 'options' as any;

    const fn = Property(options);

    expect(fn).toEqual(jasmine.any(Function));

    fn('target', 'prop');

    expect(setPropertyType).toHaveBeenCalledWith('target', 'prop', options);
  });
});
