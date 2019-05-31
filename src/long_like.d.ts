
/**
 * Base class for Long and Timestamp.
 * In original js-node@1.0.x code 'Timestamp' is a 100% copy-paste of 'Long'
 * with 'Long' replaced by 'Timestamp' (changed to inheritance in js-node@2.0.0)
 */
export class LongLike<T> {

  /**
   * @param low The low (signed) 32 bits.
   * @param high The high (signed) 32 bits.
   */
  constructor(low: number, high: number);

  /** Returns the sum of `this` and the `other`. */
  add(other: T): T;
  /** Returns the bitwise-AND of `this` and the `other`. */
  and(other: T): T;
  /**
   * Compares `this` with the given `other`.
   * @returns 0 if they are the same, 1 if the this is greater, and -1 if the given one is greater.
   */
  compare(other: T): number;
  /** Returns `this` divided by the given `other`. */
  div(other: T): T;
  /** Return whether `this` equals the `other` */
  equals(other: T): boolean;
  /** Return the high 32-bits value. */
  getHighBits(): number;
  /** Return the low 32-bits value. */
  getLowBits(): number;
  /** Return the low unsigned 32-bits value. */
  getLowBitsUnsigned(): number;
  /** Returns the number of bits needed to represent the absolute value of `this`. */
  getNumBitsAbs(): number;
  /** Return whether `this` is greater than the `other`. */
  greaterThan(other: T): boolean;
  /** Return whether `this` is greater than or equal to the `other`. */
  greaterThanOrEqual(other: T): boolean;
  /** Return whether `this` value is negative. */
  isNegative(): boolean;
  /** Return whether `this` value is odd. */
  isOdd(): boolean;
  /** Return whether `this` value is zero. */
  isZero(): boolean;
  /** Return whether `this` is less than the `other`. */
  lessThan(other: T): boolean;
  /** Return whether `this` is less than or equal to the `other`. */
  lessThanOrEqual(other: T): boolean;
  /** Returns `this` modulo the given `other`. */
  modulo(other: T): T;
  /** Returns the product of `this` and the given `other`. */
  multiply(other: T): T;
  /** The negation of this value. */
  negate(): T;
  /** The bitwise-NOT of this value. */
  not(): T;
  /** Return whether `this` does not equal to the `other`. */
  notEquals(other: T): boolean;
  /** Returns the bitwise-OR of `this` and the given `other`. */
  or(other: T): T;
  /**
   * Returns `this` with bits shifted to the left by the given amount.
   * @param numBits The number of bits by which to shift.
   */
  shiftLeft(numBits: number): T;
  /**
   * Returns `this` with bits shifted to the right by the given amount.
   * @param numBits The number of bits by which to shift.
   */
  shiftRight(numBits: number): T;
  /**
   * Returns `this` with bits shifted to the right by the given amount, with the new top bits matching the current sign bit.
   * @param numBits The number of bits by which to shift.
   */
  shiftRightUnsigned(numBits: number): T;
  /** Returns the difference of `this` and the given `other`. */
  subtract(other: T): T;
  /** Return the int value (low 32 bits). */
  toInt(): number;
  /** Return the JSON value. */
  toJSON(): string;
  /** Returns closest floating-point representation to `this` value */
  toNumber(): number;
  /**
   * Return as a string
   * @param radix the radix in which the text should be written. {default:10}
   */
  toString(radix?: number): string;
  /** Returns the bitwise-XOR of `this` and the given `other`. */
  xor(other: T): T;

}
