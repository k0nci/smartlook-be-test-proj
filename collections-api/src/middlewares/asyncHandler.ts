import { RequestHandler } from 'express';

export function middleware(reqHandler: RequestHandler): RequestHandler<any, any, any, any> {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  return (req, res, next) => {
    return Promise.resolve(reqHandler(req, res, next)).catch(next);
  };
}
