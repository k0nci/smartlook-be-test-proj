import { RequestHandler, Request } from 'express';
import jwtMiddleware from 'express-jwt';

function getTokenFromHeader(req: Request): string | null {
  const { authorization } = req.headers;
  if (!authorization || Array.isArray(authorization)) {
    return null;
  }

  const authSplitted = authorization.split(' ');
  if (authSplitted[0] === 'Token' || authSplitted[0] === 'Bearer') {
    return authSplitted[1];
  }
  return null;
}

export function middleware(accessTokenSecret: string, required: boolean = true): RequestHandler<any, any, any, any> {
  return jwtMiddleware({
    algorithms: ['HS256'],
    secret: accessTokenSecret,
    getToken: getTokenFromHeader,
    credentialsRequired: required,
  });
}
