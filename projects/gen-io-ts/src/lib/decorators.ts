import { setPropertyType, TypeMetadata } from './metadata';

/**
 * Decorator that will collect property type metadata
 * and construct a runtime type guard for it to use with `io-ts`
 */
export function Property(options?: TypeMetadata<any>): PropertyDecorator {
  return (target, prop) => setPropertyType(target, prop, options);
}
