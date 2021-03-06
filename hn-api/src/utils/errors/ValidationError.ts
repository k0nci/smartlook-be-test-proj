import { HttpError } from './HttpError';

export class ValidationError extends HttpError {
  private static STATUS_CODE = 400;

  constructor(details?: any) {
    super('Validation error', ValidationError.STATUS_CODE, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
