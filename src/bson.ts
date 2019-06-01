'use strict';

// import * as bufferModule from 'buffer';
// const Buffer = bufferModule.Buffer;

// import { Buffer } from 'buffer';

const Buffer = require('buffer').Buffer;

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
import * as EJSON from './extended_json';

const _Map = Map;

import {
  BSON_INT32_MAX,
  BSON_INT32_MIN,
  BSON_INT64_MAX,
  BSON_INT64_MIN,
  JS_INT_MAX,
  JS_INT_MIN,
  BSON_DATA_NUMBER,
  BSON_DATA_STRING,
  BSON_DATA_OBJECT,
  BSON_DATA_ARRAY,
  BSON_DATA_BINARY,
  BSON_DATA_UNDEFINED,
  BSON_DATA_OID,
  BSON_DATA_BOOLEAN,
  BSON_DATA_DATE,
  BSON_DATA_NULL,
  BSON_DATA_REGEXP,
  BSON_DATA_DBPOINTER,
  BSON_DATA_CODE,
  BSON_DATA_SYMBOL,
  BSON_DATA_CODE_W_SCOPE,
  BSON_DATA_INT,
  BSON_DATA_TIMESTAMP,
  BSON_DATA_LONG,
  BSON_DATA_DECIMAL128,
  BSON_DATA_MIN_KEY,
  BSON_DATA_MAX_KEY,
  BSON_BINARY_SUBTYPE_DEFAULT,
  BSON_BINARY_SUBTYPE_FUNCTION,
  BSON_BINARY_SUBTYPE_BYTE_ARRAY,
  BSON_BINARY_SUBTYPE_UUID,
  BSON_BINARY_SUBTYPE_MD5,
  BSON_BINARY_SUBTYPE_USER_DEFINED,
} from './constants';
export {
  // constants
  // NOTE: this is done this way because rollup can't resolve an `Object.assign`ed export
  BSON_INT32_MAX,
  BSON_INT32_MIN,
  BSON_INT64_MAX,
  BSON_INT64_MIN,
  JS_INT_MAX,
  JS_INT_MIN,
  BSON_DATA_NUMBER,
  BSON_DATA_STRING,
  BSON_DATA_OBJECT,
  BSON_DATA_ARRAY,
  BSON_DATA_BINARY,
  BSON_DATA_UNDEFINED,
  BSON_DATA_OID,
  BSON_DATA_BOOLEAN,
  BSON_DATA_DATE,
  BSON_DATA_NULL,
  BSON_DATA_REGEXP,
  BSON_DATA_DBPOINTER,
  BSON_DATA_CODE,
  BSON_DATA_SYMBOL,
  BSON_DATA_CODE_W_SCOPE,
  BSON_DATA_INT,
  BSON_DATA_TIMESTAMP,
  BSON_DATA_LONG,
  BSON_DATA_DECIMAL128,
  BSON_DATA_MIN_KEY,
  BSON_DATA_MAX_KEY,
  BSON_BINARY_SUBTYPE_DEFAULT,
  BSON_BINARY_SUBTYPE_FUNCTION,
  BSON_BINARY_SUBTYPE_BYTE_ARRAY,
  BSON_BINARY_SUBTYPE_UUID,
  BSON_BINARY_SUBTYPE_MD5,
  BSON_BINARY_SUBTYPE_USER_DEFINED,

  // wrapped types
  Code,
  BSONSymbol,
  DBRef,
  Binary,
  ObjectId,
  Long,
  Timestamp,
  Double,
  Int32,
  MinKey,
  MaxKey,
  BSONRegExp,
  Decimal128,

  // legacy support
  ObjectId as ObjectID,
  _Map as Map,

  // Extended JSON
  EJSON
};

// Parts of the parser
import { deserialize as internalDeserialize } from './parser/deserializer';
import { serializeInto as internalSerialize } from './parser/serializer';
import { calculateObjectSize as internalCalculateObjectSize } from './parser/calculate_size';
import { ensureBuffer } from './ensure_buffer';

/**
 * @ignore
 */
// Default Max Size
const MAXSIZE = 1024 * 1024 * 17;

// Current Internal Temporary Serialization Buffer
let _buffer = Buffer.alloc(MAXSIZE);

/**
 * Sets the size of the internal serialization buffer.
 *
 * @method
 * @param {number} size The desired size for the internal serialization buffer
 */
export function setInternalBufferSize(size: number) {
  // Resize the internal serialization buffer if needed
  if (_buffer.length < size) {
    _buffer = Buffer.alloc(size);
  }
}

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

/**
 * Serialize a Javascript object.
 *
 * @param {Object} object the Javascript object to serialize.
 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
 * @return {Buffer} returns the Buffer object containing the serialized object.
 */
export function serialize(object: any, options?: SerializeOptions): Buffer {
  options = options || {};
  // Unpack the options
  const checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
  const serializeFunctions =
    typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
  const ignoreUndefined =
    typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
  const minInternalBufferSize =
    typeof options.minInternalBufferSize === 'number' ? options.minInternalBufferSize : MAXSIZE;

  // Resize the internal serialization buffer if needed
  if (_buffer.length < minInternalBufferSize) {
    _buffer = Buffer.alloc(minInternalBufferSize);
  }

  // Attempt to serialize
  const serializationIndex = internalSerialize(
    _buffer,
    object,
    checkKeys,
    0,
    0,
    serializeFunctions,
    ignoreUndefined,
    []
  );

  // Create the final buffer
  const finishedBuffer = Buffer.alloc(serializationIndex);

  // Copy into the finished buffer
  _buffer.copy(finishedBuffer, 0, 0, finishedBuffer.length);

  // Return the buffer
  return finishedBuffer;
}

/**
 * Serialize a Javascript object using a predefined Buffer and index into the buffer, useful when pre-allocating the space for serialization.
 *
 * @param {Object} object the Javascript object to serialize.
 * @param {Buffer} buffer the Buffer you pre-allocated to store the serialized BSON object.
 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
 * @param {Number} [options.index] the index in the buffer where we wish to start serializing into.
 * @return {Number} returns the index pointing to the last written byte in the buffer.
 */
export function serializeWithBufferAndIndex(object: any, finalBuffer: Buffer, options: SerializeWithBufferAndIndexOptions) {
  options = options || {};
  // Unpack the options
  const checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
  const serializeFunctions =
    typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
  const ignoreUndefined =
    typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
  const startIndex = typeof options.index === 'number' ? options.index : 0;

  // Attempt to serialize
  const serializationIndex = internalSerialize(
    _buffer,
    object,
    checkKeys,
    0,
    0,
    serializeFunctions,
    ignoreUndefined
  );
  _buffer.copy(finalBuffer, startIndex, 0, serializationIndex);

  // Return the index
  return startIndex + serializationIndex - 1;
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

/**
 * Deserialize data as BSON.
 *
 * @param {Buffer} buffer the buffer containing the serialized set of BSON documents.
 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
 * @param {boolean} [options.allowObjectSmallerThanBufferSize=false] allows the buffer to be larger than the parsed BSON object
 * @return {Object} returns the deserialized Javascript Object.
 */
export function deserialize(buffer: Buffer, options?: DeserializeOptions): any {
  buffer = ensureBuffer(buffer);
  return internalDeserialize(buffer, options);
}

export interface CalculateObjectSizeOptions {
  /** {default:false}, serialize the javascript functions */
  serializeFunctions?: boolean;
  /** {default:true}, ignore undefined fields. */
  ignoreUndefined?: boolean;
}

/**
 * Calculate the bson size for a passed in Javascript object.
 *
 * @param {Object} object the Javascript object to calculate the BSON byte size for.
 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
 * @return {Number} returns the number of bytes the BSON object will take up.
 */
export function calculateObjectSize(object: any, options?: CalculateObjectSizeOptions) {
  options = options || {};

  const serializeFunctions =
    typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
  const ignoreUndefined =
    typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;

  return internalCalculateObjectSize(object, serializeFunctions, ignoreUndefined);
}

export interface DeserializeStreamOptions extends DeserializeOptions {
  index?: number;
}

/**
 * Deserialize stream data as BSON documents.
 *
 * @param {Buffer} data the buffer containing the serialized set of BSON documents.
 * @param {Number} startIndex the start index in the data Buffer where the deserialization is to start.
 * @param {Number} numberOfDocuments number of documents to deserialize.
 * @param {Array} documents an array where to store the deserialized documents.
 * @param {Number} docStartIndex the index in the documents array from where to start inserting documents.
 * @param {Object} [options] additional options used for the deserialization.
 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
 * @return {Number} returns the next index in the buffer after deserialization **x** numbers of documents.
 */
export function deserializeStream(data: Buffer, startIndex: number, numberOfDocuments: number, documents: any[], docStartIndex: number, options?: DeserializeStreamOptions) {
  options = Object.assign({ allowObjectSmallerThanBufferSize: true }, options);
  data = ensureBuffer(data);

  let index = startIndex;
  // Loop over all documents
  for (let i = 0; i < numberOfDocuments; i++) {
    // Find size of the document
    const size =
      data[index] | (data[index + 1] << 8) | (data[index + 2] << 16) | (data[index + 3] << 24);
    // Update options with index
    options.index = index;
    // Parse the document at this point
    documents[docStartIndex + i] = internalDeserialize(data, options);
    // Adjust index by the document size
    index = index + size;
  }

  // Return object containing end index of parsing and list of documents
  return index;
}
