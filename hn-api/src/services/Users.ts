import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UsersRepository } from '@smartlook/repositories/Users';
import { User } from '@smartlook/models/User';

export const enum UsersServiceErr {
  USER_EXISTS = 'USER_EXISTS',
}

type RegisterUserData = {
  email: string;
  password: string;
};

export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async registerUser(data: RegisterUserData): Promise<User> {
    const userExists = await this.usersRepo.getOne({ email: data.email });
    if (userExists) {
      throw new Error(UsersServiceErr.USER_EXISTS);
    }

    const pwdHash = await this.createPasswordHash(data.password);
    const user: User = {
      id: uuidv4(),
      email: data.email,
      password: pwdHash,
    };
    await this.usersRepo.insertOne(user);
    return user;
  }

  private async createPasswordHash(password: string): Promise<string> {
    // TODO: Configure rounds from config
    return await bcrypt.hash(password, 14);
  }
}
