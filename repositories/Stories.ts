import { Story } from '@smartlook/models/Story';
import { deserializeStories, serializeStories } from './mappers/story';
import { PgPool, PgRepository, Transaction } from './PgAbstract';

type GetOneByQuery = {
  id?: number;
  author?: string;
  title?: string;
};

type GetAllByQuery = {
  collectionId?: string;
};

type DeleteOneByQuery = {
  id?: number;
};

export class StoriesRepository extends PgRepository<Story> {
  private static TABLE_NAME = 'stories';

  constructor(pool: PgPool) {
    super(pool, StoriesRepository.TABLE_NAME, serializeStories, deserializeStories);
  }

  async getOne(by?: GetOneByQuery, tx: Transaction | null = null): Promise<Story | null> {
    let query = this.pool.select('*').from(this.tableName);

    // TODO: Use forloop throw "by" object keys
    if (by?.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    if (by?.author !== undefined) {
      query = query.where('author', '=', by.author);
    }
    if (by?.title !== undefined) {
      query = query.where('title', '=', by.title);
    }
    query = query.limit(1);

    const resultSet = await this.execQuery(query, tx);
    const comments = this.deserialize(resultSet);
    return comments[0] || null;
  }

  async getAll(by?: GetAllByQuery, tx: Transaction | null = null): Promise<Story[]> {
    let query = this.pool(this.tableName);

    if (by?.collectionId !== undefined) {
      query = query
        .join('collections_stories', 'collections_stories.story_id', `${this.tableName}.id`)
        .join('collections', 'collections.id', 'collections_stories.collection_id')
        .where('collections.id', '=', by.collectionId);
    }
    query = query.select(`${this.tableName}.*`);

    const resultSet = await this.execQuery(query, tx);
    return this.deserialize(resultSet);
  }

  async upsertOne(story: Story, tx: Transaction | null = null): Promise<void> {
    return this.upsertAll([story], tx);
  }

  async upsertAll(stories: Story[], tx: Transaction | null = null): Promise<void> {
    if (stories.length === 0) {
      return;
    }
    const storiesSerialized = this.serialize(stories);
    const query = this.pool(this.tableName).insert(storiesSerialized).onConflict('id').merge();
    await this.execQuery(query, tx);
  }

  async deleteAll(by?: DeleteOneByQuery, tx: Transaction | null = null): Promise<void> {
    let query = this.pool(this.tableName).delete();
    if (by?.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    await this.execQuery(query, tx);
  }
}
