import { Router } from 'express';
import middlewares from '../middlewares';
import { UsersServiceErr } from '../services/Users';
import { getLogger } from '../utils';
import { HttpError } from '../utils/errors/HttpError';
import { InternalServerError } from '../utils/errors/InternalServerError';
import { registerUserSchema } from '../validation/schemas/users';
import { RegisterUserBody } from '../validation/types/users';

const LOGGER = getLogger();

export const router = Router();

router.post<any, any, RegisterUserBody>('/', middlewares.validate(registerUserSchema), async (req, res, next) => {
  const app = req.app;

  try {
    const user = await app.services.users.registerUser(req.body);
    return res.status(204).end();
  } catch (err) {
    let httpError: HttpError;
    switch (err.message) {
      case UsersServiceErr.USER_EXISTS: {
        httpError = new HttpError(UsersServiceErr.USER_EXISTS, 409);
        break;
      }
      default: {
        LOGGER.error(err);
        httpError = new InternalServerError();
        break;
      }
    }
    return next(httpError);
  }
});
