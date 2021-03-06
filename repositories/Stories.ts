import { Story } from '@smartlook/models/Story';
import { deserializeStories, serializeStories } from './mappers/story';
import { PgPool, PgRepository } from './PgBase';

type GetOneByQuery = {
  id?: number;
  author?: string;
  title?: string;
}

export class StoriesRepository extends PgRepository<Story> {
  private static TABLE_NAME = 'stories';

  constructor(pool: PgPool) {
    super(pool, StoriesRepository.TABLE_NAME, serializeStories, deserializeStories);
  }

  async getOne(by?: GetOneByQuery): Promise<Story | null> {
    let query = this.pool.select('*')
      .from(this.tableName);

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

    const resultSet = await query.limit(1);
    const comments = this.deserialize(resultSet);
    return comments[0] || null;
  }
}
