import { NextFunction, Response } from 'express';
import { Request } from 'express-validator/src/base';
import { TokenExpiredError } from 'jsonwebtoken';
import { CustomError } from '../errors';

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({ error: err.message });
  }

  res
    .status(400)
    .json({ errors: [{ message: err.message || 'Something Went Wrong' }] });
};
