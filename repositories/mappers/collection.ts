import { Collection } from '@smartlook/models/Collection';
import { ResultSet } from '../PgBase';

export function deserializeCollections(resultSet: ResultSet): Collection[] {
  return resultSet.map((row) => ({
    id: row.id,
    name: row.name,
    ownerId: row.owner_id,
  }));
}

type CollectionSerialized = {
  id: string;
  name: string;
  owner_id: string;
};

export function serializeCollections(collections: Collection[]): CollectionSerialized[] {
  return collections.map((one) => ({
    id: one.id,
    name: one.name,
    owner_id: one.ownerId,
  }));
}
