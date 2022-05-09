import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { InvalidRequestParameters } from '../errors';

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new InvalidRequestParameters(errors.array());
  }

  next();
};