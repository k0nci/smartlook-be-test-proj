import { Router } from 'express';
import middlewares from '../middlewares';
import { TokensServiceErr } from '../services/Tokens';
import { getLogger } from '../utils';
import { HttpError } from '../utils/errors/HttpError';
import { InternalServerError } from '../utils/errors/InternalServerError';
import { createTokensSchema } from '../validation/schemas/tokens';
import { CreateTokensBody } from '../validation/types/tokens';

const LOGGER = getLogger();

export const router = Router();

router.post<any, { userId: string; accessToken: string }, CreateTokensBody>(
  '/',
  middlewares.validate(createTokensSchema),
  async (req, res, next) => {
    const app = req.app;

    try {
      const response = await app.services.tokens.createTokens(req.body);
      return res.status(200).json(response);
    } catch (err) {
      let httpErr: HttpError;
      switch (err.message) {
        case TokensServiceErr.USER_UNAUTHORIZED: {
          httpErr = new HttpError('UNAUTHORIZED', 401);
          break;
        }
        default: {
          LOGGER.error(err);
          httpErr = new InternalServerError();
          break;
        }
      }
      return next(httpErr);
    }
  },
);
