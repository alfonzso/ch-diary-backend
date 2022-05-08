import { CustomError } from './customError';

export class RouteNotFound extends CustomError {
  statusCode: number = 404;
  constructor() {
    super('Route not found');
    Object.setPrototypeOf(this, RouteNotFound.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}
