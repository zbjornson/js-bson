/**
 * A class representation of the BSON Double type.
 */
export default class Double {
  /**
   * Create a Double type
   *
   * @param {number} value the number we want to represent as a double.
   * @return {Double}
   */
  private value: number;
  readonly _bsontype!:{ value: 'Double' };

  constructor(value: number) {
    this.value = value;
  }

  /**
   * Access the number value.
   *
   * @method
   * @return {number} returns the wrapped double number.
   */
  valueOf() {
    return this.value;
  }

  /**
   * @ignore
   */
  toJSON() {
    return this.value;
  }

  /**
   * @ignore
   */
  toExtendedJSON(options: any) {
    if (options && options.relaxed && isFinite(this.value)) return this.value;
    return { $numberDouble: this.value.toString() };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc: any, options: any) {
    return options && options.relaxed
      ? parseFloat(doc.$numberDouble)
      : new Double(parseFloat(doc.$numberDouble));
  }
}

Object.defineProperty(Double.prototype, '_bsontype', { value: 'Double' });
