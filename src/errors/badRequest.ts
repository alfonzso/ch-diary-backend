import { CustomError } from './customError';
// import { TokenExpiredError } from 'jsonwebtoken';

export class BadRequest extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequest.prototype);
  }

  serializeErrors() {
    return { message: this.message };
  }
}
