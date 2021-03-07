import { HttpError } from './HttpError';

export class ForbiddenError extends HttpError {
  private static STATUS_CODE = 403;

  constructor(message: string = 'Forbidden', details?: any) {
    super(ForbiddenError.STATUS_CODE, message, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
