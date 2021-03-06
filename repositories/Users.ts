import { User } from '@smartlook/models/User';
import { deserializeUsers, serializeUsers } from './mappers/user';
import { PgPool, PgRepository } from './PgBase';

type GetOneByQuery = {
  id?: string;
  email?: string;
}

export class UsersRepository extends PgRepository<User> {
  private static TABLE_NAME = 'users'
  constructor(pool: PgPool) {
    super(pool, UsersRepository.TABLE_NAME, serializeUsers, deserializeUsers);
  }

  async getOne(by?: GetOneByQuery): Promise<User | null> {
    let query = this.pool.select('*')
      .from(this.tableName);

    // TODO: Use forloop throw "by" object keys
    if (by?.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    if (by?.email !== undefined) {
      query = query.where('email', '=', by.email);
    }

    const resultSet = await query.limit(1);
    const comments = this.deserialize(resultSet);
    return comments[0] || null;
  }

}