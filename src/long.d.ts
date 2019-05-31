
import { LongLike } from './long_like';
/**
 * A class representation of the BSON Long type, a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "Long". This
 * implementation is derived from LongLib in GWT.
 */
export class Long extends LongLike<Long> {

  static readonly MAX_VALUE: Long;
  static readonly MIN_VALUE: Long;
  static readonly NEG_ONE: Long;
  static readonly ONE: Long;
  static readonly ZERO: Long;

  /** Returns a Long representing the given (32-bit) integer value. */
  static fromInt(i: number): Long;
  /** Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned. */
  static fromNumber(n: number): Long;
  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating the given high and low bits. Each is assumed to use 32 bits.
   * @param lowBits The low 32-bits.
   * @param highBits The high 32-bits.
   */
  static fromBits(lowBits: number, highBits: number): Long;
  /**
   * Returns a Long representation of the given string
   * @param opt_radix The radix in which the text is written. {default:10}
   */
  static fromString(s: string, opt_radix?: number): Long;

}
