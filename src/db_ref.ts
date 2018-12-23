import ObjectId from './objectid';

/**
 * A class representation of the BSON DBRef type.
 */
export default class DBRef {
  private collection: string;
  private oid: ObjectId;
  private db?: string;
  private fields: any;
  readonly _bsontype!: { value: 'DBRef' };

  /**
   * Create a DBRef type
   *
   * @param {string} collection the collection name.
   * @param {ObjectId} oid the reference ObjectId.
   * @param {string} [db] optional db name, if omitted the reference is local to the current db.
   * @return {DBRef}
   */
  constructor(collection: string, oid: ObjectId, db?: string, fields?: any) {
    // check if namespace has been provided
    const parts = collection.split('.');
    if (parts.length === 2) {
      db = parts.shift() as string;
      collection = parts.shift() as string;
    }

    this.collection = collection;
    this.oid = oid;
    this.db = db;
    this.fields = fields || {};
  }

  /**
   * @ignore
   * @api private
   */
  toJSON() {
    const o = Object.assign(
      {
        $ref: this.collection,
        $id: this.oid
      },
      this.fields
    );

    if (this.db != null) o.$db = this.db;
    return o;
  }

  /**
   * @ignore
   */
  toExtendedJSON() {
    let o : {$ref: string, $id: ObjectId, $db?: string } = {
      $ref: this.collection,
      $id: this.oid
    };

    if (this.db) o.$db = this.db;
    o = Object.assign(o, this.fields);
    return o;
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc: any) {
    var copy = Object.assign({}, doc);
    ['$ref', '$id', '$db'].forEach(k => delete copy[k]);
    return new DBRef(doc.$ref, doc.$id, doc.$db, copy);
  }
}

Object.defineProperty(DBRef.prototype, '_bsontype', { value: 'DBRef' });
