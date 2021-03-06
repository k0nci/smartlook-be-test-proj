export class HttpError extends Error {
  readonly status: number;
  readonly details: any;
  readonly stack: string = '';

  constructor(message: string, status: number, details: any = undefined, error?: Error) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = status;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    if (error) {
      const messageLines = (this.message.match(/\n/g) || []).length + 1;
      // tslint:disable-next-line: max-line-length prefer-template
      this.stack = this.stack.split('\n').slice(0, messageLines + 1).join('\n') + `\n${error.stack}`;
    }
  }
}
