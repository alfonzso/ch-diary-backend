import { CustomError } from './CustomError';

export class UnauthorizedError extends CustomError {
  statusCode: number = 401;

  constructor() {
    super('Unauthorized Access');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  // serializeErrors
  serializeErrors() {
    return [{ message: 'Unauthorized Access' }];
  }
}
