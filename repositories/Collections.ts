import { Collection } from '@smartlook/models/Collection';
import { deserializeCollections, serializeCollections } from './mappers/collection';
import { PgPool, PgRepository } from './PgBase';

type GetOneByQuery = {
  id?: string;
  name?: string;
  ownerId?: string;
};

export class CollectionsRepository extends PgRepository<Collection> {
  private static TABLE_NAME = 'collections';
  constructor(pool: PgPool) {
    super(pool, CollectionsRepository.TABLE_NAME, serializeCollections, deserializeCollections);
  }

  async getOne(by?: GetOneByQuery): Promise<Collection> {
    let query = this.pool.select('*').from(this.tableName);

    // TODO: Use forloop throw "by" object keys
    if (by?.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    if (by?.name !== undefined) {
      query = query.where('name', '=', by.name);
    }
    if (by?.ownerId !== undefined) {
      query = query.where('owner_id', '=', by.ownerId);
    }

    const resultSet = await query.limit(1);
    const comments = this.deserialize(resultSet);
    return comments[0] || null;
  }

  async updateOne(collection: Collection): Promise<void> {
    const collectionSerialized = this.serialize([collection]);
    await this.pool(this.tableName).update(collectionSerialized);
  }
}
