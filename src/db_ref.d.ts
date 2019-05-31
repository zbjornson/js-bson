import { ObjectId } from './objectid';

/**
 * A class representation of the BSON DBRef type.
 * @deprecated
 */
export class DBRef {
  /**
   * @param namespace The collection name.
   * @param oid The reference ObjectId.
   * @param db Optional db name, if omitted the reference is local to the current db
   */
  constructor(namespace: string, oid: ObjectId, db?: string);
  namespace: string;
  oid: ObjectId;
  db?: string;
}
