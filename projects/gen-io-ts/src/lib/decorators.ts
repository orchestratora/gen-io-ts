import { setPropertyType } from './metadata';
import { RuntimeType } from './runtime-types';

export function Property(customType?: RuntimeType): PropertyDecorator {
  return (target, prop) => setPropertyType(target, prop, customType);
}
