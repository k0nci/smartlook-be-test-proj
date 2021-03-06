import { Comment } from '@smartlook/models/Comment';
import { deserializeComments } from './mappers/comment.mapper';
import { PgPool, PgRepository } from './pg.repo';

type GetOneByQuery = {
  id?: BigInt;
  parent?: BigInt;
  author?: string;
}

export class CommentsRepository extends PgRepository<Comment> {
  private static TABLE_NAME = 'comments'
  constructor(pool: PgPool) {
    super(pool);
  }

  async getOne(by: GetOneByQuery): Promise<Comment | null> {
    let query = this.pool.select('*')
      .from(CommentsRepository.TABLE_NAME);

    // TODO: Use forloop throw "by" object keys
    if (by.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    if (by.parent !== undefined) {
      query = query.where('parent', '=', by.parent);
    }
    if (by.author !== undefined) {
      query = query.where('author', '=', by.author);
    }

    const resultSet = await query.limit(1);
    const comments = deserializeComments(resultSet);
    return comments[0] || null;
  }

  async insertOne(comment: Comment): Promise<void> {
    return this.pool.insert(comment).into(CommentsRepository.TABLE_NAME);
  }

}