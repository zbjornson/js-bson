"use strict";

const BSON = require(".");
// const dataAsJSON = require("./experiments.json");
// const dataAsBSON = BSON.serialize(dataAsJSON);
// require("fs").writeFileSync("./data.bson", dataAsBSON);
// process.exit(0);

const dataAsBSON = require("fs").readFileSync("./data.bson");

let deser;
console.time("deser");
for (let i = 0; i < 10; i++) {
	// deser = JSON.stringify(BSON.deserialize(dataAsBSON)); // 1965ms
	deser = BSON.deserialize(dataAsBSON); // 1700ms
	// Transcoder: 570ms
}
console.timeEnd("deser");
require("fs").writeFileSync("./out.json", deser);

require("./out.json");

// console.log(deser.toString());
// bson-ext is nearly twice as slow
// const BSON_EXT = require('bson-ext');
// // Create a bson parser instance, passing in all the types
// // This is needed so the C++ parser has references to the classes and can
// // use them to serialize and deserialize the types.
// const instance = new BSON_EXT([
// 	BSON_EXT.Binary,
// 	BSON_EXT.Code,
// 	BSON_EXT.DBRef,
// 	BSON_EXT.Decimal128,
// 	BSON_EXT.Double,
// 	BSON_EXT.Int32,
// 	BSON_EXT.Long,
// 	BSON_EXT.Map,
// 	BSON_EXT.MaxKey,
// 	BSON_EXT.MinKey,
// 	BSON_EXT.ObjectId,
// 	BSON_EXT.BSONRegExp,
// 	BSON_EXT.Symbol,
// 	BSON_EXT.Timestamp
// ]);

// // Deserialize the resulting Buffer
// console.time("deser-ext");
// for (let i = 0; i < 50; i++) {
// 	deser = instance.deserialize(dataAsBSON);
// }
// console.timeEnd("deser-ext");
