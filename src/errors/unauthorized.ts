import { CustomError } from './customError';

export class UnauthorizedError extends CustomError {
  // statusCode: number = 401;
  statusCode = 401;
  // reason = ''

  constructor(public reason: string = '') {
    super('Unauthorized Access');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  // serializeErrors
  serializeErrors() {
    // return [{ message: 'Unauthorized Access' , reason: this.reason }];
    return { message: 'Unauthorized Access', reason: this.reason };
  }
}
