/**
 * A class representation of the BSON Code type.
 */
export class Code {
  readonly _bsonvalue: 'Code';
  /**
   * Create a Code type
   *
   * @param {(string|function)} code a string or function.
   * @param {Object} [scope] an optional scope for the function.
   * @return {Code}
   */
  constructor(public readonly code: string | Function, public readonly scope?: any) {
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
