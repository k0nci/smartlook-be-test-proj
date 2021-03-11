import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UsersRepository } from '@smartlook/repositories/Users';
import { User } from '@smartlook/models/User';

export const enum UsersServiceErr {
  USER_EXISTS = 'USER_EXISTS',
  USER_UNAUTHORIZED = 'USER_UNAUTHORIZED',
}

type Config = {
  BCRYPT_SALT_ROUNDS: number;
};

type RegisterUserData = {
  email: string;
  password: string;
};

export class UsersService {
  constructor(private usersRepo: UsersRepository, private config: Config) {}

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

  async getUserByEmailAndPassword({ email, password }: { email: string, password: string }): Promise<User> {
    const user = await this.usersRepo.getOne({ email });
    if (!user) {
      throw new Error(UsersServiceErr.USER_UNAUTHORIZED);
    }

    const isPwdValid = await this.checkPassword(user.password, password);
    if (!isPwdValid) {
      throw new Error(UsersServiceErr.USER_UNAUTHORIZED);
    }
    return user;
  }

  private async createPasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.BCRYPT_SALT_ROUNDS);
  }

  private async checkPassword(userPwd: string, providedPwd: string): Promise<boolean> {
    return bcrypt.compare(providedPwd, userPwd);
  }
}
