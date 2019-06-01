import * as Long from 'long';

/**
 * @ignore
 */
Long.prototype.toExtendedJSON = function(this: Long, options: any) {
  if (options && options.relaxed) return this.toNumber();
  return { $numberLong: this.toString() };
};

/**
 * @ignore
 */
(Long.fromExtendedJSON as any) = function(doc: any, options: any) {
  const result = Long.fromString(doc.$numberLong);
  return options && options.relaxed ? result.toNumber() : result;
};

Object.defineProperty(Long.prototype, '_bsontype', { value: 'Long' });

export { Long };
