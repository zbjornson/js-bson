import { Long } from './long';
import { Double } from './double';
import { Timestamp } from './timestamp';
import { ObjectId } from './objectid';
import { Code } from './code';
import { MinKey } from './min_key';
import { MaxKey } from './max_key';
import { Decimal128 } from './decimal128';
import { Int32 } from './int_32';
import { DBRef } from './db_ref';
import { BSONRegExp } from './regexp';
import { Binary } from './binary';
import { BSONSymbol } from './symbol';

/**
 * @namespace EJSON
 */

// all the types where we don't need to do any special processing and can just pass the EJSON
//straight to type.fromExtendedJSON
const keysToCodecs = {
  $oid: ObjectId,
  $binary: Binary,
  $symbol: BSONSymbol,
  $numberInt: Int32,
  $numberDecimal: Decimal128,
  $numberDouble: Double,
  $numberLong: Long,
  $minKey: MinKey,
  $maxKey: MaxKey,
  $regularExpression: BSONRegExp,
  $timestamp: Timestamp
};

export interface EJSONParseOptions {
  strict?: boolean;
  relaxed?: boolean;
}

export interface EJSONStringifyOptions {
  relaxed?: boolean;
}

function deserializeValue(self: any, key: unknown, value: any, options: EJSONParseOptions) {
  if (typeof value === 'number') {
    if (options.relaxed) {
      return value;
    }

    // if it's an integer, should interpret as smallest BSON integer
    // that can represent it exactly. (if out of range, interpret as double.)
    if (Math.floor(value) === value) {
      if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) return new Int32(value);
      if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX) return Long.fromNumber(value);
    }

    // If the number is a non-integer or out of integer range, should interpret as BSON Double.
    return new Double(value);
  }

  // from here on out we're looking for bson types, so bail if its not an object
  if (typeof value !== 'object' || value == null) return value;

  // upgrade deprecated undefined to null
  if (value.$undefined) return null;

  const keys = Object.keys(value).filter(k => k.startsWith('$') && value[k] != null);
  for (let i = 0; i < keys.length; i++) {
    let c = keysToCodecs[keys[i] as keyof typeof keysToCodecs];
    if (c) return c.fromExtendedJSON(value, options);
  }

  if (value.$date != null) {
    const d = value.$date;
    const date = new Date();

    if (typeof d === 'string') date.setTime(Date.parse(d));
    else if (Long.isLong(d)) date.setTime(d.toNumber());
    else if (typeof d === 'number' && options.relaxed) date.setTime(d);
    return date;
  }

  if (value.$code != null) {
    let copy = Object.assign({}, value);
    if (value.$scope) {
      copy.$scope = deserializeValue(self, null, value.$scope, options);
    }

    return Code.fromExtendedJSON(value);
  }

  if (value.$ref != null || value.$dbPointer != null) {
    let v = value.$ref ? value : value.$dbPointer;

    // we run into this in a "degenerate EJSON" case (with $id and $ref order flipped)
    // because of the order JSON.parse goes through the document
    if (v instanceof DBRef) return v;

    const dollarKeys = Object.keys(v).filter(k => k.startsWith('$'));
    let valid = true;
    dollarKeys.forEach(k => {
      if (['$ref', '$id', '$db'].indexOf(k) === -1) valid = false;
    });

    // only make DBRef if $ keys are all valid
    if (valid) return DBRef.fromExtendedJSON(v);
  }

  return value;
}

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
export function parse(this: any, text: string, options: EJSONParseOptions) {
  options = Object.assign({}, { relaxed: true }, options);

  // relaxed implies not strict
  if (typeof options.relaxed === 'boolean') options.strict = !options.relaxed;
  if (typeof options.strict === 'boolean') options.relaxed = !options.strict;

  return JSON.parse(text, (key, value) => deserializeValue(this, key, value, options));
}

//
// Serializer
//

// MAX INT32 boundaries
const BSON_INT32_MAX = 0x7fffffff,
  BSON_INT32_MIN = -0x80000000,
  BSON_INT64_MAX = 0x7fffffffffffffff,
  BSON_INT64_MIN = -0x8000000000000000;

/**
 * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
 * function is specified or optionally including only the specified properties if a replacer array
 * is specified.
 *
 * @memberof EJSON
 * @param {object} value The value to convert to extended JSON
 * @param {function|array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
 * @param {string|number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes.
 * @param {object} [options] Optional settings
 * @param {boolean} [options.relaxed=true] Enabled Extended JSON's `relaxed` mode
 * @returns {string}
 *
 * @example
 * const { EJSON } = require('bson');
 * const Int32 = require('mongodb').Int32;
 * const doc = { int32: new Int32(10) };
 *
 * // prints '{"int32":{"$numberInt":"10"}}'
 * console.log(EJSON.stringify(doc, { relaxed: false }));
 *
 * // prints '{"int32":10}'
 * console.log(EJSON.stringify(doc));
 */

type Stringify0 = Parameters<typeof JSON.stringify>[0];
type Stringify1 = Parameters<typeof JSON.stringify>[1];
type Stringify2 = Parameters<typeof JSON.stringify>[2];

export function stringify(value: Stringify0, options?: EJSONStringifyOptions): string;
export function stringify(value: Stringify0, replacer: Stringify1, options?: EJSONStringifyOptions): string;
export function stringify(value: Stringify0, replacer: Stringify1, space: Stringify2, options?: EJSONStringifyOptions): string;
export function stringify(
  value: Stringify0,
  replacer?: Stringify1|EJSONStringifyOptions,
  space?: Stringify2|EJSONStringifyOptions,
  options?: EJSONStringifyOptions
) {
  if (typeof space === 'object' && space != null) {
    options = space;
    space = 0;
  }
  if (replacer != null && typeof replacer === 'object' && !Array.isArray(replacer)) {
    options = replacer;
    replacer = null;
    space = 0;
  }
  options = Object.assign({}, { relaxed: true }, options);

  const doc = Array.isArray(value)
    ? serializeArray(value, options)
    : serializeDocument(value, options);

  return JSON.stringify(doc, replacer, space as Stringify2);
}

/**
 * Serializes an object to an Extended JSON string, and reparse it as a JavaScript object.
 *
 * @memberof EJSON
 * @param {object} bson The object to serialize
 * @param {object} [options] Optional settings passed to the `stringify` function
 * @return {object}
 */
export function serialize(bson: any, options?: EJSONStringifyOptions) {
  options = options || {} as EJSONStringifyOptions;
  return JSON.parse(stringify(bson, options));
}

/**
 * Deserializes an Extended JSON object into a plain JavaScript object with native/BSON types
 *
 * @memberof EJSON
 * @param {object} ejson The Extended JSON object to deserialize
 * @param {object} [options] Optional settings passed to the parse method
 * @return {object}
 */
export function deserialize(ejson: any, options?: EJSONParseOptions) {
  options = options || {} as EJSONParseOptions;
  return parse(JSON.stringify(ejson), options);
}

function serializeArray(array: any[], options: EJSONStringifyOptions): any[] {
  return array.map(v => serializeValue(v, options));
}

function getISOString(date: Date) {
  const isoStr = date.toISOString();
  // we should only show milliseconds in timestamp if they're non-zero
  return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + 'Z';
}

function serializeValue(value: unknown, options: EJSONStringifyOptions) {
  if (Array.isArray(value)) return serializeArray(value, options);

  if (value === undefined) return null;

  if (value instanceof Date) {
    let dateNum = value.getTime(),
      // is it in year range 1970-9999?
      inRange = dateNum > -1 && dateNum < 253402318800000;

    return options.relaxed && inRange
      ? { $date: getISOString(value) }
      : { $date: { $numberLong: value.getTime().toString() } };
  }

  if (typeof value === 'number' && !options.relaxed) {
    // it's an integer
    if (Math.floor(value) === value) {
      let int32Range = value >= BSON_INT32_MIN && value <= BSON_INT32_MAX,
        int64Range = value >= BSON_INT64_MIN && value <= BSON_INT64_MAX;

      // interpret as being of the smallest BSON integer type that can represent the number exactly
      if (int32Range) return { $numberInt: value.toString() };
      if (int64Range) return { $numberLong: value.toString() };
    }
    return { $numberDouble: value.toString() };
  }

  if (value instanceof RegExp) {
    let flags = value.flags;
    if (flags === undefined) {
      flags = (value.toString().match(/[gimuy]*$/) as RegExpMatchArray)[0];
    }

    const rx = new BSONRegExp(value.source, flags);
    return rx.toExtendedJSON();
  }

  if (value != null && typeof value === 'object') return serializeDocument(value, options);
  return value;
}

const BSON_TYPE_MAPPINGS: Record<string, (o: any) => any> = {
  Binary: (o: any) => new Binary(o.value(), o.subtype),
  Code: (o: any) => new Code(o.code, o.scope),
  DBRef: (o: any) => new DBRef(o.collection || o.namespace, o.oid, o.db, o.fields), // "namespace" for 1.x library backwards compat
  Decimal128: (o: any) => new Decimal128(o.bytes),
  Double: (o: any) => new Double(o.value),
  Int32: (o: any) => new Int32(o.value),
  Long: (o: any) =>
    Long.fromBits(
      // underscore variants for 1.x backwards compatibility
      o.low != null ? o.low : o.low_,
      o.low != null ? o.high : o.high_,
      o.low != null ? o.unsigned : o.unsigned_
    ),
  MaxKey: () => new MaxKey(),
  MinKey: () => new MinKey(),
  ObjectID: (o: any) => new ObjectId(o),
  ObjectId: (o: any) => new ObjectId(o), // support 4.0.0/4.0.1 before _bsontype was reverted back to ObjectID
  BSONRegExp: (o: any) => new BSONRegExp(o.pattern, o.options),
  Symbol: (o: any) => new BSONSymbol(o.value),
  Timestamp: (o: any) => Timestamp.fromBits(o.low, o.high)
};

function serializeDocument(doc: unknown, options: EJSONStringifyOptions) {
  if (typeof doc !== 'object' || doc == null) throw new Error('not an object instance');

  const bsontype = (doc as any)._bsontype;
  if (typeof bsontype === 'undefined') {
    // It's a regular object. Recursively serialize its property values.
    const _doc = {};
    for (let name in doc) {
      (_doc as any)[name] = serializeValue((doc as any)[name], options);
    }
    return _doc;
  } else if (typeof bsontype === 'string') {
    // the "document" is really just a BSON type object
    let _doc = doc;
    if (typeof (_doc as any).toExtendedJSON !== 'function') {
      // There's no EJSON serialization function on the object. It's probably an
      // object created by a previous version of this library (or another library)
      // that's duck-typing objects to look like they were generated by this library).
      // Copy the object into this library's version of that type.
      const mapper = BSON_TYPE_MAPPINGS[bsontype];
      if (!mapper) {
        throw new TypeError('Unrecognized or invalid _bsontype: ' + bsontype);
      }
      _doc = mapper(_doc);
    }

    // Two BSON types may have nested objects that may need to be serialized too
    if (bsontype === 'Code' && (_doc as any).scope) {
      _doc = new Code((_doc as any).code, serializeValue((_doc as any).scope, options));
    } else if (bsontype === 'DBRef' && (_doc as any).oid) {
      _doc = new DBRef((_doc as any).collection, serializeValue((_doc as any).oid, options), (_doc as any).db, (_doc as any).fields);
    }

    return (_doc as any).toExtendedJSON(options);
  } else {
    throw new Error('_bsontype must be a string, but was: ' + typeof bsontype);
  }
}
