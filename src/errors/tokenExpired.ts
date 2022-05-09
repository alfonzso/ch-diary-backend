import { CustomError } from './customError';

export interface ITokenExpired {
  reason: string
  expiredAt: Date
}

export class TokenExpired extends CustomError {
  statusCode = 401;
  data: ITokenExpired;

  constructor(data: ITokenExpired) {
    super('TokenExpiredError');
    this.data = data;
    Object.setPrototypeOf(this, TokenExpired.prototype);
  }

  serializeErrors() {
    return { message: this.message, ...this.data };
  }
}
