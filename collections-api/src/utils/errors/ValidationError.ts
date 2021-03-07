import { HttpError } from './HttpError';

export class ValidationError extends HttpError {
  private static STATUS_CODE = 400;

  constructor(details?: any) {
    super(ValidationError.STATUS_CODE, 'Validation error', details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
