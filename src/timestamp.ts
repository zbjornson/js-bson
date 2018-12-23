'use strict';

import Long from './long';

/**
 * @class
 * @param {number} low  the low (signed) 32 bits of the Timestamp.
 * @param {number} high the high (signed) 32 bits of the Timestamp.
 * @return {Timestamp}
 */
export default class Timestamp extends Long {
  readonly _bsontype!: { value: 'Timestamp' };

  constructor(low: number, high: number);
  constructor(low: Long)
  constructor(low: number|Long, high?: number) {
    if (low instanceof Long) {
      super(low.low, low.high);
    } else {
      super(low, high);
    }
  }

  /**
   * Return the JSON value.
   *
   * @method
   * @return {String} the JSON representation.
   */
  toJSON() {
    return {
      $timestamp: this.toString()
    };
  }

  /**
   * Returns a Timestamp represented by the given (32-bit) integer value.
   *
   * @method
   * @param {number} value the 32-bit integer in question.
   * @return {Timestamp} the timestamp.
   */
  static fromInt(value: number) {
    return new Timestamp(Long.fromInt(value));
  }

  /**
   * Returns a Timestamp representing the given number value, provided that it is a finite number. Otherwise, zero is returned.
   *
   * @method
   * @param {number} value the number in question.
   * @return {Timestamp} the timestamp.
   */
  static fromNumber(value: number) {
    return new Timestamp(Long.fromNumber(value));
  }

  /**
   * Returns a Timestamp for the given high and low bits. Each is assumed to use 32 bits.
   *
   * @method
   * @param {number} lowBits the low 32-bits.
   * @param {number} highBits the high 32-bits.
   * @return {Timestamp} the timestamp.
   */
  static fromBits(lowBits: number, highBits: number) {
    return new Timestamp(lowBits, highBits);
  }

  /**
   * Returns a Timestamp from the given string, optionally using the given radix.
   *
   * @method
   * @param {String} str the textual representation of the Timestamp.
   * @param {number} [opt_radix] the radix in which the text is written.
   * @return {Timestamp} the timestamp.
   */
  static fromString(str: string, opt_radix: number) {
    return new Timestamp(Long.fromString(str, opt_radix));
  }

  /**
   * @ignore
   */
  toExtendedJSON() {
    return { $timestamp: { t: this.high, i: this.low } };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc: any) {
    return new Timestamp(doc.$timestamp.i, doc.$timestamp.t);
  }
}

Object.defineProperty(Timestamp.prototype, '_bsontype', { value: 'Timestamp' });
