import { Long } from './long';

/**
 * @class
 * @param {number} low  the low (signed) 32 bits of the Timestamp.
 * @param {number} high the high (signed) 32 bits of the Timestamp.
 * @return {Timestamp}
 */
export class Timestamp extends Long {
  constructor(low: number, high: number)
  constructor(low: Long);
  constructor(low: number|Long, high?: number) {
    if (Long.isLong(low)) {
      super((low as Long).low, (low as Long).high, true);
    } else {
      super((low as number), high, true);
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
    return new Timestamp(Long.fromInt(value, true));
  }

  /**
   * Returns a Timestamp representing the given number value, provided that it is a finite number. Otherwise, zero is returned.
   *
   * @method
   * @param {number} value the number in question.
   * @return {Timestamp} the timestamp.
   */
  static fromNumber(value: number) {
    return new Timestamp(Long.fromNumber(value, true));
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
    return new Timestamp(Long.fromString(str, true, opt_radix));
  }

  /**
   * @ignore
   */
  toExtendedJSON() {
    return { $timestamp: { t: this.high >>> 0, i: this.low >>> 0 } };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc: any): Timestamp {
    return new Timestamp(doc.$timestamp.i, doc.$timestamp.t);
  }

  static MAX_VALUE = Long.MAX_UNSIGNED_VALUE;
}

Object.defineProperty(Timestamp.prototype, '_bsontype', { value: 'Timestamp' });
