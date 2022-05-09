import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { TokenExpired, UnauthorizedError } from '../errors';

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

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) return next(new UnauthorizedError())

  try {
    const token = authorization!.split(' ')[1];
    req.payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as UserPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new TokenExpired({ reason: err.message, expiredAt: err.expiredAt }))
    }
    return next(new UnauthorizedError())
  }
  return next();
};
