import { CustomError } from './customError';

export class FailToAddNewEntryError extends CustomError {
  // statusCode: number = 401;
  statusCode = 401;

  constructor(public reason: string = '') {
    super('Fail To Add New Entry');
    Object.setPrototypeOf(this, FailToAddNewEntryError.prototype);
  }

  // serializeErrors
  serializeErrors() {
    // return [{ message: 'Unauthorized Access' , reason: this.reason }];
    return { message: 'Fail To Add New Entry', reason: this.reason };
  }
}
