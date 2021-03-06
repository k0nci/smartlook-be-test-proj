import { Comment } from '@smartlook/models/Comment';
import { deserializeComments } from './deserializers/comment.deserializer';
import { PgPool, PgRepository } from './pg.repository';

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

  async getOne(by: GetOneByQuery): Promise<Comment> {
    let query = this.pool.select('*')
      .from(CommentsRepository.TABLE_NAME);

    // TODO: Use forloop throw object keys
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
    return comments[0];
  }

  async insertOne(comment: Comment): Promise<void> {
    return this.pool.insert(comment).into(CommentsRepository.TABLE_NAME);
  }

}