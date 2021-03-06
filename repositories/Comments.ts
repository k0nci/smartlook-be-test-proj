import { Comment } from '@smartlook/models/Comment';
import { deserializeComments, serializeComments } from './mappers/comment';
import { PgPool, PgRepository } from './PgBase';

type GetOneByQuery = {
  id?: number;
  parent?: number;
  author?: string;
}

export class CommentsRepository extends PgRepository<Comment> {
  private static TABLE_NAME = 'comments';
  constructor(pool: PgPool) {
    super(pool, CommentsRepository.TABLE_NAME, serializeComments, deserializeComments);
  }

  async getOne(by?: GetOneByQuery): Promise<Comment | null> {
    let query = this.pool.select('*')
      .from(CommentsRepository.TABLE_NAME);

    // TODO: Use forloop throw "by" object keys
    if (by?.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    if (by?.parent !== undefined) {
      query = query.where('parent', '=', by.parent);
    }
    if (by?.author !== undefined) {
      query = query.where('author', '=', by.author);
    }

    const resultSet = await query.limit(1);
    const comments = deserializeComments(resultSet);
    return comments[0] || null;
  }

}