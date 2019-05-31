/** A class representation of the BSON Binary type. */
export class Binary {

  static readonly SUBTYPE_DEFAULT: number;
  static readonly SUBTYPE_FUNCTION: number;
  static readonly SUBTYPE_BYTE_ARRAY: number;
  static readonly SUBTYPE_UUID_OLD: number;
  static readonly SUBTYPE_UUID: number;
  static readonly SUBTYPE_MD5: number;
  static readonly SUBTYPE_USER_DEFINED: number;

  /**
   * @param buffer A buffer object containing the binary data
   * @param subType Binary data subtype
   */
  constructor(buffer: Buffer, subType?: number);

  /** The underlying Buffer which stores the binary data. */
  readonly buffer: Buffer;
  /** Binary data subtype */
  readonly sub_type?: number;

  /** The length of the binary. */
  length(): number;
  /** Updates this binary with byte_value */
  put(byte_value: number | string): void;
  /** Reads length bytes starting at position. */
  read(position: number, length: number): Buffer;
  /** Returns the value of this binary as a string. */
  value(): string;
  /** Writes a buffer or string to the binary */
  write(buffer: Buffer | string, offset: number): void;
}
