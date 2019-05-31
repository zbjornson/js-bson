
/** A class representation of the BSON ObjectId type. */
export class ObjectId {
  /**
   * Create a new ObjectId instance
   * @param {(string|number|ObjectId)} id Can be a 24 byte hex string, 12 byte binary string or a Number.
   */
  constructor(id?: string | number | ObjectId);
  /** The generation time of this ObjectId instance */
  generationTime: number;
  /** If true cache the hex string representation of ObjectId */
  static cacheHexString?: boolean;
  /**
   * Creates an ObjectId from a hex string representation of an ObjectId.
   * @param {string} hexString create a ObjectId from a passed in 24 byte hexstring.
   * @return {ObjectId} return the created ObjectId
   */
  static createFromHexString(hexString: string): ObjectId;
  /**
   * Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.
   * @param {number} time an integer number representing a number of seconds.
   * @return {ObjectId} return the created ObjectId
   */
  static createFromTime(time: number): ObjectId;
  /**
   * Checks if a value is a valid bson ObjectId
   *
   * @return {boolean} return true if the value is a valid bson ObjectId, return false otherwise.
   */
  static isValid(id: string | number | ObjectId): boolean;
  /**
   * Compares the equality of this ObjectId with `otherID`.
   * @param {ObjectId|string} otherID ObjectId instance to compare against.
   * @return {boolean} the result of comparing two ObjectId's
   */
  equals(otherID: ObjectId | string): boolean;
  /**
   * Generate a 12 byte id string used in ObjectId's
   * @param {number} time optional parameter allowing to pass in a second based timestamp.
   * @return {string} return the 12 byte id binary string.
   */
  static generate(time?: number): Buffer;
  /**
   * Returns the generation date (accurate up to the second) that this ID was generated.
   * @return {Date} the generation date
   */
  getTimestamp(): Date;
  /**
   * Return the ObjectId id as a 24 byte hex string representation
   * @return {string} return the 24 byte hex string representation.
   */
  toHexString(): string;
}
