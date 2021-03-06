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
    super(pool);
  }

  async getOne(by?: GetOneByQuery): Promise<User | null> {
    let query = this.pool.select('*')
      .from(UsersRepository.TABLE_NAME);

    // TODO: Use forloop throw "by" object keys
    if (by?.id !== undefined) {
      query = query.where('id', '=', by.id);
    }
    if (by?.email !== undefined) {
      query = query.where('email', '=', by.email);
    }

    const resultSet = await query.limit(1);
    const comments = deserializeUsers(resultSet);
    return comments[0] || null;
  }

  async insertOne(user: User): Promise<void> {
    const userSerialized = serializeUsers([user]);
    return this.pool.insert(userSerialized).into(UsersRepository.TABLE_NAME);
  }

}