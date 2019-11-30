//@ts-check
'use strict';

const Buffer = require('buffer').Buffer;
const Long = require('../long');
const constants = require('../constants');
const validateUtf8 = require('../validate_utf8').validateUtf8;

// Internal long versions
const JS_INT_MAX_LONG = Long.fromNumber(constants.JS_INT_MAX); // TODO I think this const is off by one
const JS_INT_MIN_LONG = Long.fromNumber(constants.JS_INT_MIN);

function readInt32LE(buffer, index) {
  return (
    buffer[index] | (buffer[index + 1] << 8) | (buffer[index + 2] << 16) | (buffer[index + 3] << 24)
  );
}

let outIdx = 0;
function deserialize(buffer, options, isArray) {
  options = options == null ? {} : options;
  const index = options && options.index ? options.index : 0;
  // Read the document size
  const size = readInt32LE(buffer, index);

  if (size < 5) throw new Error(`bson size must be >= 5, is ${size}`);

  if (options.allowObjectSmallerThanBufferSize && buffer.length < size)
    throw new Error(`buffer length ${buffer.length} must be >= bson size ${size}`);

  if (!options.allowObjectSmallerThanBufferSize && buffer.length !== size)
    throw new Error(`buffer length ${buffer.length} must === bson size ${size}`);

  if (size + index > buffer.length) {
    throw new Error(
      `(bson size ${size} + options.index ${index} must be <= buffer length ${buffer.length})`
    );
  }

  // Illegal end value
  if (buffer[index + size - 1] !== 0) {
    throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
  }

  const out = Buffer.alloc(1e8); // TODO overrun protection
  outIdx = 0;
  deserializeObject(out, buffer, index, options, true || isArray);
  return out.slice(0, outIdx);
}

const QUOTE = '"'.charCodeAt(0);
const COLON = ':'.charCodeAt(0);
const COMMA = ','.charCodeAt(0);
const OPENSQ = '['.charCodeAt(0);
const OPENCURL = '{'.charCodeAt(0);
const CLOSESQ = ']'.charCodeAt(0);
const CLOSECURL = '}'.charCodeAt(0);
const BACKSLASH = '\\'.charCodeAt(0);
const TRUE = Buffer.from('true');
const FALSE = Buffer.from('false');
const NULL = Buffer.from('null');

const ESCAPES = {
  8: 'b'.charCodeAt(0),
  9: 't'.charCodeAt(0),
  10: 'n'.charCodeAt(0),
  12: 'f'.charCodeAt(0),
  13: 'r'.charCodeAt(0),
  34: 34, // "
  47: 47, // /
  92: 92 // \
};

function writeStringRange(out, str, start, end) {
  for (let i = start; i < end; i++) {
    const c = str[i];
    let xc;
    if (c > 47 && c !== 92) {
      out[outIdx++] = c;
    } else if ((xc = ESCAPES[c])) {
      out[outIdx++] = BACKSLASH;
      out[outIdx++] = xc;
    } else {
      out[outIdx++] = c;
    }
  }
}

/**
 * @param {Buffer} out
 * @param {Buffer} buffer
 * @param {number} index
 * @param {boolean} isArray
 */
function deserializeObject(out, buffer, index, options, isArray) {
  // Validate that we have at least 4 bytes of buffer
  if (buffer.length < 5) throw new Error('corrupt bson message < 5 bytes long');

  // Read the document size
  const size = readInt32LE(buffer, index);
  index += 4;

  // Ensure buffer is valid size
  if (size < 5 || size > buffer.length) throw new Error('corrupt bson message');

  let first = true;
  let done = false;

  let addQuotedStringRange, addQuotedVal, addVal;
  let nameStart, nameEnd;
  if (isArray) {
    out[outIdx++] = OPENSQ;
    addQuotedStringRange = (start, end) => {
      out[outIdx++] = QUOTE;
      writeStringRange(out, buffer, start, end);
      out[outIdx++] = QUOTE;
    };
    addQuotedVal = val => {
      out[outIdx++] = QUOTE;
      for (let i = 0; i < val.length; i++) out[outIdx++] = val[i];
      out[outIdx++] = QUOTE;
    };
    addVal = val => {
      for (let i = 0; i < val.length; i++) out[outIdx++] = val[i];
    };
  } else {
    out[outIdx++] = OPENCURL;
    addQuotedStringRange = (start, end) => {
      out[outIdx++] = QUOTE;
      writeStringRange(out, buffer, nameStart, nameEnd);
      out[outIdx++] = QUOTE;
      out[outIdx++] = COLON;
      out[outIdx++] = QUOTE;
      writeStringRange(out, buffer, start, end);
      out[outIdx++] = QUOTE;
    };
    addQuotedVal = val => {
      out[outIdx++] = QUOTE;
      writeStringRange(out, buffer, nameStart, nameEnd);
      out[outIdx++] = QUOTE;
      out[outIdx++] = COLON;
      out[outIdx++] = QUOTE;
      for (let i = 0; i < val.length; i++) out[outIdx++] = val[i];
      out[outIdx++] = QUOTE;
    };
    addVal = val => {
      out[outIdx++] = QUOTE;
      writeStringRange(out, buffer, nameStart, nameEnd);
      out[outIdx++] = QUOTE;
      out[outIdx++] = COLON;
      for (let i = 0; i < val.length; i++) out[outIdx++] = val[i];
    };
  }

  while (!done) {
    const elementType = buffer[index++];

    // If we get a zero it's the last byte, exit
    if (elementType === 0) break;

    // Name is a null-terminated string.
    nameStart = nameEnd = index;
    while (buffer[nameEnd] !== 0x00 && nameEnd < buffer.length) {
      nameEnd++;
    }

    if (nameEnd >= buffer.length) throw new Error('Bad BSON Document: illegal CString');

    if (first) {
      first = false;
    } else {
      out[outIdx++] = COMMA;
    }

    index = nameEnd + 1;

    switch (elementType) {
      case constants.BSON_DATA_STRING: {
        const stringSize = readInt32LE(buffer, index);
        index += 4;
        if (
          stringSize <= 0 ||
          stringSize > buffer.length - index ||
          buffer[index + stringSize - 1] !== 0
        )
          throw new Error('bad string length in bson');

        if (!validateUtf8(buffer, index, index + stringSize - 1))
          throw new Error('Invalid UTF-8 string in BSON document');

        addQuotedStringRange(index, index + stringSize - 1);

        index = index + stringSize;
        break;
      }
      case constants.BSON_DATA_OID: {
        const value = Buffer.from(buffer.toString('hex', index, index + 12)); // TODO transcode
        addQuotedVal(value);

        index = index + 12;
        break;
      }
      case constants.BSON_DATA_INT: {
        const value = readInt32LE(buffer, index);
        addVal(Buffer.from(value.toString()));
        index += 4;
        break;
      }
      case constants.BSON_DATA_NUMBER: {
        const value = buffer.readDoubleLE(index);
        addVal(Buffer.from(value.toString()));
        index = index + 8;
        break;
      }
      case constants.BSON_DATA_DATE: {
        const lowBits = readInt32LE(buffer, index);
        index += 4;
        const highBits = readInt32LE(buffer, index);
        index += 4;
        const value = Buffer.from(new Date(new Long(lowBits, highBits).toNumber()).toString());
        addQuotedVal(Buffer.from(value.toString()));
        break;
      }
      case constants.BSON_DATA_BOOLEAN: {
        if (buffer[index] !== 0 && buffer[index] !== 1)
          throw new Error('illegal boolean type value');
        const value = buffer[index++] === 1;
        addVal(value ? TRUE : FALSE);
        break;
      }
      case constants.BSON_DATA_OBJECT: {
        const objectSize = readInt32LE(buffer, index);
        if (objectSize <= 0 || objectSize > buffer.length - index)
          throw new Error('bad embedded document length in bson');

        addVal([]);
        deserializeObject(out, buffer, index, options, false);

        index = index + objectSize;
        break;
      }
      case constants.BSON_DATA_ARRAY: {
        const objectSize = readInt32LE(buffer, index);
        const stopIndex = index + objectSize;

        addVal([]);
        deserializeObject(out, buffer, index, options, true);

        index = index + objectSize;

        if (buffer[index - 1] !== 0) throw new Error('invalid array terminator byte');
        if (index !== stopIndex) throw new Error('corrupted array bson');
        break;
      }
      case constants.BSON_DATA_NULL: {
        addVal(NULL);
        break;
      }
      case constants.BSON_DATA_LONG: {
        // Unpack the low and high bits
        const lowBits = readInt32LE(buffer, index);
        index += 4;
        const highBits = readInt32LE(buffer, index);
        index += 4;
        const long = new Long(lowBits, highBits);
        const vx =
          long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG)
            ? long.toNumber()
            : long;
        const value = Buffer.from(vx.toString());
        addVal(value);
        break;
      }
      case constants.BSON_DATA_UNDEFINED: // noop
      case constants.BSON_DATA_DECIMAL128:
      case constants.BSON_DATA_BINARY:
      case constants.BSON_DATA_REGEXP:
      case constants.BSON_DATA_SYMBOL:
      case constants.BSON_DATA_TIMESTAMP:
      case constants.BSON_DATA_MIN_KEY:
      case constants.BSON_DATA_MAX_KEY:
      case constants.BSON_DATA_CODE:
      case constants.BSON_DATA_CODE_W_SCOPE:
      case constants.BSON_DATA_DBPOINTER:
        // incompatible JSON type
        break;
      default:
        throw new Error('Detected unknown BSON type ' + elementType.toString(16));
    }
  }

  out[outIdx++] = isArray ? CLOSESQ : CLOSECURL;

  return outIdx;
}

module.exports = deserialize;
