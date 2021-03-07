import jwt from 'jsonwebtoken';
import { UsersService, UsersServiceErr } from './Users';

enum LocalErr {

}

export const TokensServiceErr = { ...UsersServiceErr, ...LocalErr };

type Config = {
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN_SECONDS: number;
};

type CreateTokensData = {
  email: string;
  password: string;
};

export class TokensService {
  constructor(private usersService: UsersService, private config: Config) {}

  async createTokens(data: CreateTokensData): Promise<{ userId: string, accessToken: string }> {
    const user = await this.usersService.getUserByEmailAndPassword(data);

    const accessToken = this.createJwtToken(
      this.config.ACCESS_TOKEN_SECRET,
      {
        userId: user.id,
        userEmail: user.email,
      },
      {
        expiresInSeconds: this.config.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      },
    );
    return {
      userId: user.id,
      accessToken,
    };
  }

  private createJwtToken(
    secret: string,
    data: { userId: string; userEmail: string },
    options?: { expiresInSeconds: number },
  ): string {
    return jwt.sign(data, secret, { expiresIn: options?.expiresInSeconds });
  }
}
