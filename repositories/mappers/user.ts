import { User } from '@smartlook/models/User';
import { ResultSet } from '../PgAbstract';

export function deserializeUsers(resultSet: ResultSet): User[] {
  return resultSet.map((row) => row as User);
}

type UserSerialized = {
  id: string;
  email: string;
  password: string;
};

export function serializeUsers(users: User[]): UserSerialized[] {
  return users.map((one) => one as UserSerialized);
}
