import { NextFunction, Response } from 'express';
import { Request } from 'express-validator/src/base';
import Container from 'typedi';
import { Logger } from 'winston';
import { CustomError } from '../errors';
import myLogger from '../utils/myLogger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    myLogger('Got some of customError: ', err.serializeErrors().message)
    return res.status(err.statusCode).json({ error: err.serializeErrors() });
  }

  return res
    .status(400)
    .json({ errors: [{ message: err.message || 'Something Went Wrong' }] });
};
