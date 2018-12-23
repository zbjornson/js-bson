/**
 * A class representation of the BSON Code type.
 */
export default class Code {
  /**
   * Create a Code type
   *
   * @param {(string|function)} code a string or function.
   * @param {Object} [scope] an optional scope for the function.
   * @return {Code}
   */
  private code: string|Function;
  private scope: any;
  readonly _bsontype!: { value: 'Code' };
  constructor(code: string|Function, scope?: any) {
    this.code = code;
    this.scope = scope;
  }

  /**
   * @ignore
   */
  toJSON() {
    return { scope: this.scope, code: this.code };
  }

  /**
   * @ignore
   */
  toExtendedJSON() {
    if (this.scope) {
      return { $code: this.code, $scope: this.scope };
    }

    return { $code: this.code };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc: any) {
    return new Code(doc.$code, doc.$scope);
  }
}

Object.defineProperty(Code.prototype, '_bsontype', { value: 'Code' });
