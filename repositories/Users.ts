import { User } from '@smartlook/models/User';
import { deserializeUsers, serializeUsers } from './mappers/user';
import { PgPool, PgRepository, Transaction } from './PgAbstract';

type GetOneByQuery = {
  id?: string;
  email?: string;
};

export class UsersRepository extends PgRepository<User> {
  private static TABLE_NAME = 'users';
  constructor(pool: PgPool) {
    super(pool, UsersRepository.TABLE_NAME, serializeUsers, deserializeUsers);
  }

  async getOne(by?: GetOneByQuery, tx: Transaction | null = null): Promise<User | null> {
    let query = this.pool.select('*').from(this.tableName);

    // TODO: Use forloop throw "by" object keys
    if (by?.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    if (by?.email !== undefined) {
      query = query.where('email', '=', by.email);
    }
    query = query.limit(1);

    const resultSet = await this.execQuery(query, tx);
    const comments = this.deserialize(resultSet);
    return comments[0] || null;
  }
}
