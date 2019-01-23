import { setPropertyType, TypeMetadata } from './metadata';

export function Property(options?: TypeMetadata<any>): PropertyDecorator {
  return (target, prop) => setPropertyType(target, prop, options);
}
