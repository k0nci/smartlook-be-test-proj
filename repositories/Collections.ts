import { Collection } from '@smartlook/models/Collection';
import { Story } from '@smartlook/models/Story';
import { deserializeCollections, serializeCollections } from './mappers/collection';
import { PgPool, PgRepository, Transaction } from './PgAbstract';

type GetOneByQuery = {
  id?: string;
  name?: string;
  ownerId?: string;
};

export class CollectionsRepository extends PgRepository<Collection> {
  static readonly TABLE_NAME = 'collections';
  constructor(pool: PgPool) {
    super(pool, CollectionsRepository.TABLE_NAME, serializeCollections, deserializeCollections);
  }

  async getOne(by?: GetOneByQuery, tx: Transaction | null = null): Promise<Collection> {
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
    query = query.limit(1);

    const resultSet = await this.execQuery(query, tx);
    const comments = this.deserialize(resultSet);
    return comments[0] || null;
  }

  async updateOne(collection: Collection, tx: Transaction | null = null): Promise<void> {
    const [collectionSerialized] = this.serialize([collection]);
    const query = this.pool(this.tableName).update(collectionSerialized).where('id', '=', collection.id);
    await this.execQuery(query, tx);
  }

  async upsertStoriesToCollection(
    collectionId: string,
    stories: Story[],
    tx: Transaction | null = null,
  ): Promise<void> {
    if (stories.length === 0) {
      return;
    }
    const collectionStories: Array<{ collection_id: string; story_id: number }> = stories.map((story) => ({
      collection_id: collectionId,
      story_id: story.id,
    }));

    const query = this.pool('collections_stories')
      .insert(collectionStories)
      .onConflict(['collection_id', 'story_id'])
      .merge();
    await this.execQuery(query, tx);
  }

  async deleteOne(collection: Collection, tx: Transaction | null = null): Promise<void> {
    const isLocalTx = tx === null;
    const txLocal = tx ?? await this.beginTransaction();

    try {
      const collectionStoriesQuery = this.pool('collections_stories')
        .delete()
        .where('collection_id', '=', collection.id);
      const collectionsQuery = this.pool(this.tableName).delete().where('id', '=', collection.id);
      await this.execQuery(collectionStoriesQuery, txLocal);
      await this.execQuery(collectionsQuery, txLocal);

      if (isLocalTx) {
        await txLocal.commit();
      }
    } catch (err) {
      if (isLocalTx) {
        await txLocal.rollback();
      }
      throw err;
    }
  }
}
