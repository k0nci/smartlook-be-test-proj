import { Router } from 'express';
import middlewares from '../middlewares';
import { UsersServiceErr } from '../services/Users';
import { HttpError } from '../utils/errors/HttpError';
import { InternalServerError } from '../utils/errors/InternalServerError';
import { registerUserSchema } from '../validation/schemas/users';
import { RegisterUserBody } from '../validation/types/users';

export const router = Router();

router.post<any, any, RegisterUserBody>(
  '/',
  middlewares.validate(registerUserSchema),
  middlewares.asyncHandler(async (req, res, next) => {
    const app = req.app;

    try {
      await app.services.users.registerUser(req.body);
      return res.status(204).end();
    } catch (err) {
      let httpError: HttpError;
      switch (err.message) {
        case UsersServiceErr.USER_EXISTS: {
          httpError = new HttpError(409, UsersServiceErr.USER_EXISTS);
          break;
        }
        default: {
          httpError = new InternalServerError(err);
          break;
        }
      }
      return next(httpError);
    }
  }),
);
