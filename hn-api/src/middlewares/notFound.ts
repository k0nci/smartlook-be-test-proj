import { RequestHandler } from 'express';
import { HttpError } from '../utils/errors/HttpError';

export function middleware(): RequestHandler {
  return (req, res, next) => {
    const err = new HttpError('Not found', 404);
    return next(err);
  };
}
