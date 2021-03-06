import { HttpError } from './HttpError';

export class InternalServerError extends HttpError {
  private static STATUS_CODE = 500;

  constructor(message: string | Error = 'Internal server error') {
    if (message instanceof Error) {
      super('Internal server error', InternalServerError.STATUS_CODE, message);
    } else {
      super(message, InternalServerError.STATUS_CODE);
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
