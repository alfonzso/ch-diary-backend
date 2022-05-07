import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

export class InvalidRequestParameters extends CustomError {
  statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid Request Parameters');
    Object.setPrototypeOf(this, InvalidRequestParameters.prototype)
  }

  serializeErrors() {
    return this.errors.map((err) => ({ message: err.msg, field: err.param }));
  }
}
