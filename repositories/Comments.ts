import { Comment } from '@smartlook/models/Comment';
import { deserializeComments, serializeComments } from './mappers/comment';
import { PgPool, PgRepository, Transaction } from './PgAbstract';

type GetOneByQuery = {
  id?: number;
  parent?: number;
  author?: string;
};

type DeleteAllByQuery = {
  parent?: number;
};

export class CommentsRepository extends PgRepository<Comment> {
  static readonly TABLE_NAME = 'comments';
  constructor(pool: PgPool) {
    super(pool, CommentsRepository.TABLE_NAME, serializeComments, deserializeComments);
  }

  async getOne(by?: GetOneByQuery, tx: Transaction | null = null): Promise<Comment | null> {
    let query = this.pool.select('*').from(CommentsRepository.TABLE_NAME);

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
    query = query.limit(1);

    const resultSet = await this.execQuery(query, tx);
    const comments = deserializeComments(resultSet);
    return comments[0] || null;
  }

  async deleteAll(by?: DeleteAllByQuery, tx: Transaction | null = null): Promise<void> {
    let query = this.pool(this.tableName).delete();
    if (by?.parent !== undefined) {
      query = query.where('parent', '=', by.parent);
    }
    await this.execQuery(query, tx);
  }
}
