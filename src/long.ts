'use strict';

import Long from 'long';

declare module 'long' {
  class Long {
    default: Long;
    _bsontype: { value: 'Long' };
    toExtendedJSON(options: any): any;
    static fromExtendedJSON(doc: any, options: any): Long | number;
  }
}

Object.defineProperty(Long.prototype, '_bsontype', { value: 'Long' });

// @ts-ignore
Long.prototype.toExtendedJSON = function(options: any): any {
  if (options && options.relaxed) return this.toNumber();
  return { $numberLong: this.toString() };
};

// @ts-ignore
Long.fromExtendedJSON = function(doc: any, options: any): Long | number {
  const result = Long.fromString(doc.$numberLong);
  return options && options.relaxed ? result.toNumber() : result;
};

// @ts-ignore
Long.default = Long;

export = Long;