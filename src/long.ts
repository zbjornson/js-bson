import * as _Long from 'long';

function Ctor<T>(obj: T) {
  return (obj as any).constructor as (new (...args: any) => T);
}

export class Long extends _Long {
  static MAX_UNSIGNED_VALUE = new Long(_Long.MAX_UNSIGNED_VALUE);
  static MAX_VALUE = new Long(_Long.MAX_VALUE);
  static MIN_VALUE = new Long(_Long.MIN_VALUE);
  static NEG_ONE = new Long(_Long.NEG_ONE);
  static ONE = new Long(_Long.ONE);
  static UONE = new Long(_Long.UONE);
  static UZERO = new Long(_Long.UZERO);
  static ZERO = new Long(_Long.ZERO);

  readonly _bsontype: 'Long';
  constructor(low: number, high: number, unsigned?: boolean);
  constructor(low: _Long);
  constructor(low: number|_Long, high?: number, unsigned?: boolean) {
    if (Long.isLong(low)) {
      super(low.low, low.high, low.unsigned);
    } else {
      super(low, high, unsigned);
    }
  }
  toExtendedJSON(options?: any): any {
    if (options && options.relaxed) return this.toNumber();
    return { $numberLong: this.toString() };
  }

  static fromExtendedJSON(doc: any, options?: any) {
    const result = Long.fromString(doc.$numberLong);
    return options && options.relaxed ? result.toNumber() : result;
  }

  // All of these methods do the following:
  //   1. Call the original
  //   2. wrap the return value in the BSON version of long
  // We automate the process of making those methods below
  add: (addeng: string | number | _Long) => this;
  and: (other: string | number | _Long) => this;
  div: (divisor: string | number | _Long) => this;
  modulo: (other: string | number | _Long) => this;
  multiply: (multiplier: string | number | _Long) => this;
  negate: () => this;
  not: () => this;
  or: (other: string | number | _Long) => this;
  shiftLeft: (numBits: number | _Long) => this;
  shiftRight: (numBits: number | _Long) => this;
  shiftRightUnsigned: (numBits: number | _Long) => this;
  subtract: (subrahend: string | number | _Long) => this;
  xor: (other: string | number | _Long) => this;
  static fromBits: ( lowBits: number, highBits: number, unsigned?: boolean ) => Long;
  static fromInt: ( value: number, unsigned?: boolean ) => Long;
  static fromNumber: ( value: number, unsigned?: boolean ) => Long;
  static fromString: ( str: string, unsigned?: boolean | number, radix?: number ) => Long;
  static fromBytes: ( bytes: number[], unsigned?: boolean, le?: boolean ) => Long;
  static fromBytesLE: ( bytes: number[], unsigned?: boolean ) => Long;
  static fromBytesBE: ( bytes: number[], unsigned?: boolean ) => Long;
  static fromValue: ( val: _Long | number | string | {low: number, high: number, unsigned: boolean} ) => Long;
  static isLong: (obj: any) => obj is _Long;
}

// Automate creation of overridden member functions
[
  'add',
  'and',
  'div',
  'modulo',
  'multiply',
  'negate',
  'not',
  'or',
  'shiftLeft',
  'shiftRight',
  'shiftRightUnsigned',
  'subtract',
  'xor'
].forEach(key => {
  const oldFn: (...args: any[]) => any = (_Long.prototype as any)[key];
  (Long.prototype as any)[key] = function() {
    return new (Ctor(this))(oldFn.apply(this, arguments));
  };
});

// Automate creation of overridden static functions
[
  'fromBits',
  'fromInt', 
  'fromNumber',
  'fromString',
  'fromBytes', 
  'fromBytesLE',
  'fromBytesBE',
  'fromValue'
].forEach(key => {
  const oldFn: (...args: any[]) => any = (_Long as any)[key];
  (Long as any)[key] = function() {
    return new this(oldFn.apply(this, arguments));
  };
});

Object.defineProperty(_Long.prototype, '_bsontype', { value: 'Long' });
