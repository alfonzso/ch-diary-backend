import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class InvalidRequestParameters extends CustomError {
  statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid Request Parameters');
    Object.setPrototypeOf(this, InvalidRequestParameters.prototype)
  }

  serializeErrors() {
    // return this.errors.map((err) => ({ message: err.msg, field: err.param }));
    // return this.errors.map((err) => ({ msg: err.msg, param: err.param }));
    return { message: "ValidationError", fields: this.errors.map((err) => ({ msg: err.msg, param: err.param })) };
  }
}
