import { CustomError } from './customError';

export class MissingRefreshToken extends CustomError {
  statusCode: number = 400;

  constructor() {
    super('Unauthorized Access');
    Object.setPrototypeOf(this, MissingRefreshToken.prototype);
  }

  // serializeErrors
  serializeErrors() {
    return [{ message: 'Missing refresh token !' }];
  }
}
