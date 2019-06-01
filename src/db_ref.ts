import { ObjectId } from './objectid';
/**
 * A class representation of the BSON DBRef type.
 */
export class DBRef {
  public collection: string;
  public oid: ObjectId;
  public db?: string;
  private fields: Record<string, any>;

  /**
   * Create a DBRef type
   *
   * @param {string} collection the collection name.
   * @param {ObjectId} oid the reference ObjectId.
   * @param {string} [db] optional db name, if omitted the reference is local to the current db.
   * @return {DBRef}
   */
  constructor(collection: string, oid: ObjectId, db?: string, fields?: object) {
    // check if namespace has been provided
    const parts: string[] = collection.split('.');
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
    let o : Record<string, any> = {
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

  // the 1.x parser used a "namespace" property, while 4.x uses "collection". To ensure backwards
  // compatibility, let's expose "namespace"
  get namespace() {
    return this.collection;
  }

  set namespace(val) {
    this.collection = val;
  }
}

Object.defineProperty(DBRef.prototype, '_bsontype', { value: 'DBRef' });
