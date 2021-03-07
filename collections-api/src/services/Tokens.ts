import { User } from '@smartlook/models/User';
import jwt from 'jsonwebtoken';

type Config = {
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN_SECONDS: number;
};

export class TokensService {
  constructor(private config: Config) {}

  async createTokens(user: User): Promise<{ userId: string, accessToken: string }> {
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
