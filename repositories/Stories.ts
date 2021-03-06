import { Story } from "@smartlook/models/Story";
import { deserializeStories, serializeStories } from "./mappers/story";
import { PgPool, PgRepository } from "./PgBase";

type GetOneByQuery = {
  id?: number;
  author?: string;
  title?: string;
}

export class StoriesRepository extends PgRepository<Story> {
  private static TABLE_NAME = 'stories';
  constructor(pool: PgPool) {
    super(pool);
  }

  async getOne(by?: GetOneByQuery): Promise<Story | null> {
    let query = this.pool.select('*')
      .from(StoriesRepository.TABLE_NAME);

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
    const comments = deserializeStories(resultSet);
    return comments[0] || null;
  }

  async insertOne(story: Story): Promise<void> {
    const storySerialized = serializeStories([story]);
    return this.pool.insert(storySerialized).into(StoriesRepository.TABLE_NAME);
  }

}