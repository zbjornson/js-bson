/**
 * A class representation of the BSON MinKey type.
 */
export default class MinKey {
  /**
   * Create a MinKey type
   *
   * @return {MinKey} A MinKey instance
   */
  readonly _bsontype!: { value: 'MinKey' };
  constructor() {}

  /**
   * @ignore
   */
  toExtendedJSON() {
    return { $minKey: 1 };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON() {
    return new MinKey();
  }
}

Object.defineProperty(MinKey.prototype, '_bsontype', { value: 'MinKey' });
