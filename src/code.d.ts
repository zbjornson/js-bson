/** A class representation of the BSON Code type. */
export class Code {

  /**
   * @param code A string or function.
   * @param scope An optional scope for the function.
   */
  constructor(code: string | Function, scope?: any);

  readonly code: string | Function;
  readonly scope?: any;

}
