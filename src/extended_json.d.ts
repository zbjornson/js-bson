/**
 * Functions for serializing JavaScript objects into Mongodb Extended JSON (EJSON).
 * @namespace EJSON
 */
export namespace EJSON {

  /**
   * Parse an Extended JSON string, constructing the JavaScript value or object described by that
   * string.
   *
   * @memberof EJSON
   * @param {string} text
   * @param {object} [options] Optional settings
   * @param {boolean} [options.relaxed=true] Attempt to return native JS types where possible, rather than BSON types (if true)
   * @return {object}
   *
   * @example
   * const { EJSON } = require('bson');
   * const text = '{ "int32": { "$numberInt": "10" } }';
   *
   * // prints { int32: { [String: '10'] _bsontype: 'Int32', value: '10' } }
   * console.log(EJSON.parse(text, { relaxed: false }));
   *
   * // prints { int32: 10 }
   * console.log(EJSON.parse(text));
   */
  export function parse(text: string, options?: {relaxed?: boolean;}): {};

  /**
   * Deserializes an Extended JSON object into a plain JavaScript object with native/BSON types
   *
   * @memberof EJSON
   * @param {object} ejson The Extended JSON object to deserialize
   * @param {object} [options] Optional settings passed to the parse method
   * @return {object}
   */
  export function deserialize(ejson: {}, options?: {relaxed?: boolean;}): {};

  /**
   * Serializes an object to an Extended JSON string, and reparse it as a JavaScript object.
   *
   * @memberof EJSON
   * @param {object} bson The object to serialize
   * @param {object} [options] Optional settings passed to the `stringify` function
   * @return {object}
   */
  export function serialize(bson: {}, options?: {relaxed?: boolean;}): {};

  /**
   * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
   * function is specified or optionally including only the specified properties if a replacer array
   * is specified.
   *
   * @memberof EJSON
   * @param {object} value The value to convert to extended JSON
   * @param {function|array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
   * @param {string|number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes.
   * @param {object} [options] Optional settings.
   * @param {boolean} [options.relaxed=true] Enabled Extended JSON's `relaxed` mode
   * @returns {string}
   *
   * @example
   * const { EJSON, Int32 } = require('bson');
   * const doc = { int32: new Int32(10) };
   *
   * // prints '{"int32":{"$numberInt":"10"}}'
   * console.log(EJSON.stringify(doc, { relaxed: false }));
   *
   * // prints '{"int32":10}'
   * console.log(EJSON.stringify(doc));
   */
  export function stringify(
      value: {}, 
      options?: {relaxed?: boolean;}
  ): string;

  /**
   * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
   * function is specified or optionally including only the specified properties if a replacer array
   * is specified.
   *
   * @memberof EJSON
   * @param {object} value The value to convert to extended JSON
   * @param {function|array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
   * @param {string|number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes.
   * @param {object} [options] Optional settings.
   * @param {boolean} [options.relaxed=true] Enabled Extended JSON's `relaxed` mode
   * @returns {string}
   *
   * @example
   * const { EJSON, Int32 } = require('bson');
   * const doc = { int32: new Int32(10) };
   *
   * // prints '{"int32":{"$numberInt":"10"}}'
   * console.log(EJSON.stringify(doc, { relaxed: false }));
   *
   * // prints '{"int32":10}'
   * console.log(EJSON.stringify(doc));
   */

  export function stringify(
      value: {}, 
      replacer: ((key: string, value: any) => any) | Array<string|number>, 
      options?: {relaxed?: boolean;}
  ): string;
  /**
   * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
   * function is specified or optionally including only the specified properties if a replacer array
   * is specified.
   *
   * @memberof EJSON
   * @param {object} value The value to convert to extended JSON
   * @param {function|array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
   * @param {string|number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes.
   * @param {object} [options] Optional settings.
   * @param {boolean} [options.relaxed=true] Enabled Extended JSON's `relaxed` mode
   * @returns {string}
   *
   * @example
   * const { EJSON, Int32 } = require('bson');
   * const doc = { int32: new Int32(10) };
   *
   * // prints '{"int32":{"$numberInt":"10"}}'
   * console.log(EJSON.stringify(doc, { relaxed: false }));
   *
   * // prints '{"int32":10}'
   * console.log(EJSON.stringify(doc));
   */
  export function stringify(
      value: {}, 
      replacer: ((key: string, value: any) => any) | Array<string | number>, 
      indents?: string | number, 
      options?: {relaxed?: boolean;}
      ): string;  
}
