import { LongLike } from './long_like';

/** A class representation of the BSON Timestamp type. */
export class Timestamp extends LongLike<Timestamp> {

  static readonly MAX_VALUE: Timestamp;
  static readonly MIN_VALUE: Timestamp;
  static readonly NEG_ONE: Timestamp;
  static readonly ONE: Timestamp;
  static readonly ZERO: Timestamp;

  /** Returns a Timestamp represented by the given (32-bit) integer value */
  static fromInt(value: number): Timestamp;
  /** Returns a Timestamp representing the given number value, provided that it is a finite number. */
  static fromNumber(value: number): Timestamp;
  /**
   * Returns a Timestamp for the given high and low bits. Each is assumed to use 32 bits.
   * @param lowBits The low 32-bits.
   * @param highBits The high 32-bits.
   */
  static fromBits(lowBits: number, highBits: number): Timestamp;
  /**
   * Returns a Timestamp from the given string.
   * @param opt_radix The radix in which the text is written. {default:10}
   */
  static fromString(str: string, opt_radix?: number): Timestamp;

}