interface CommonSerializeOptions {
  /** {default:false}, the serializer will check if keys are valid. */
  checkKeys?: boolean;
  /** {default:false}, serialize the javascript functions. */
  serializeFunctions?: boolean;
  /** {default:true}, ignore undefined fields. */
  ignoreUndefined?: boolean;
}

export interface SerializeOptions extends CommonSerializeOptions {
  /** {default:1024*1024*17}, minimum size of the internal temporary serialization buffer. */
  minInternalBufferSize?: number;
}

export interface SerializeWithBufferAndIndexOptions extends CommonSerializeOptions {
  /** {default:0}, the index in the buffer where we wish to start serializing into. */
  index?: number;
}

export interface DeserializeOptions {
  /** {default:false}, evaluate functions in the BSON document scoped to the object deserialized. */
  evalFunctions?: boolean;
  /** {default:false}, cache evaluated functions for reuse. */
  cacheFunctions?: boolean;
  /** {default:false}, use a crc32 code for caching, otherwise use the string of the function. */
  cacheFunctionsCrc32?: boolean;
  /** {default:true}, when deserializing a Long will fit it into a Number if it's smaller than 53 bits. */
  promoteLongs?: boolean;
  /** {default:false}, deserialize Binary data directly into node.js Buffer object. */
  promoteBuffers?: boolean;
  /** {default:false}, when deserializing will promote BSON values to their Node.js closest equivalent types. */
  promoteValues?: boolean;
  /** {default:null}, allow to specify if there what fields we wish to return as unserialized raw buffer. */
  fieldsAsRaw?: { readonly [fieldName: string]: boolean };
  /** {default:false}, return BSON regular expressions as BSONRegExp instances. */
  bsonRegExp?: boolean;
  /** {default:false}, allows the buffer to be larger than the parsed BSON object. */
  allowObjectSmallerThanBufferSize?: boolean;
}

export interface CalculateObjectSizeOptions {
  /** {default:false}, serialize the javascript functions */
  serializeFunctions?: boolean;
  /** {default:true}, ignore undefined fields. */
  ignoreUndefined?: boolean;
}


/**
* Serialize a Javascript object.
* 
* @param object The Javascript object to serialize.
* @param options Serialize options.
* @return The Buffer object containing the serialized object.
*/
export function serialize(object: any, options?: SerializeOptions): Buffer;

/**
* Serialize a Javascript object using a predefined Buffer and index into the buffer, useful when pre-allocating the space for serialization.
* 
* @param object The Javascript object to serialize.
* @param buffer The Buffer you pre-allocated to store the serialized BSON object.
* @param options Serialize options.
* @returns The index pointing to the last written byte in the buffer
*/
export function serializeWithBufferAndIndex(object: any, buffer: Buffer, options?: SerializeWithBufferAndIndexOptions): number;

/**
* Deserialize data as BSON.
* 
* @param buffer The buffer containing the serialized set of BSON documents.
* @param options Deserialize options.
* @returns The deserialized Javascript Object.
*/
export function deserialize(buffer: Buffer, options?: DeserializeOptions): any;

/**
* Calculate the bson size for a passed in Javascript object.
*
* @param {Object} object the Javascript object to calculate the BSON byte size for.
* @param {CalculateObjectSizeOptions} Options
* @return {Number} returns the number of bytes the BSON object will take up.
*/
export function calculateObjectSize(object: any, options?: CalculateObjectSizeOptions): number;

/**
* Deserialize stream data as BSON documents.
* 
* @param data The buffer containing the serialized set of BSON documents.
* @param startIndex The start index in the data Buffer where the deserialization is to start.
* @param numberOfDocuments Number of documents to deserialize
* @param documents An array where to store the deserialized documents
* @param docStartIndex The index in the documents array from where to start inserting documents
* @param options Additional options used for the deserialization
* @returns The next index in the buffer after deserialization of the `numberOfDocuments`
*/
export function deserializeStream(
  data: Buffer,
  startIndex: number,
  numberOfDocuments: number,
  documents: Array<any>,
  docStartIndex: number,
  options?: DeserializeOptions
): number;

import { Binary } from './binary';
import { Code } from './code';
import { DBRef } from './db_ref';
import { Double } from './double';
import { Int32 } from './int_32';
import { Decimal128 } from './decimal128';
import { MaxKey } from './max_key';
import { MinKey } from './min_key';
import { ObjectId } from './objectid';
import { BSONRegExp } from './regexp';
import { BSONSymbol } from './symbol';
import { Long } from './long';
import { Timestamp } from './timestamp';
import * as EJSON from './extended_json';

export {
  Binary,
  Code,
  DBRef,
  Double,
  Int32,
  Decimal128,
  MaxKey,
  MinKey,
  ObjectId,

  /**
  * ObjectID (with capital "D") is deprecated. Use ObjectId (lowercase "d") instead. 
  * @deprecated
  */
  ObjectId as ObjectID,
  BSONRegExp,
  BSONSymbol,
  Long,
  Timestamp,
  EJSON
};
