
/** A class representation of the BSON Decimal128 type. */
export class Decimal128 {

  /** Create a Decimal128 instance from a string representation. */
  static fromString(s: string): Decimal128;

  /**
   * @param bytes A buffer containing the raw Decimal128 bytes.
   */
  constructor(bytes: Buffer);

  /** A buffer containing the raw Decimal128 bytes. */
  readonly bytes: Buffer;

  toJSON(): string;
  toString(): string;
}
