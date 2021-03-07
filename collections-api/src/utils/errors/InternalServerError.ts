import { HttpError } from './HttpError';

export class InternalServerError extends HttpError {
  private static STATUS_CODE = 500;

  constructor(message: string | Error = 'Internal server error') {
    if (message instanceof Error) {
      super(InternalServerError.STATUS_CODE, 'Internal server error', message);
    } else {
      super(InternalServerError.STATUS_CODE, message);
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
