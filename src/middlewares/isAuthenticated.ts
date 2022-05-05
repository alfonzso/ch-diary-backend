import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorized';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

type UserPayload = {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      payload?: UserPayload;
    }
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) throw new UnauthorizedError()

  try {
    const token = authorization.split(' ')[1];
    req.payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as UserPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new TokenExpiredError(err.message, err.expiredAt);
    }
    throw new UnauthorizedError()
  }

  return next();
};
