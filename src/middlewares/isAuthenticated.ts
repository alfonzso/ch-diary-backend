import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { TokenExpired, UnauthorizedError } from '../errors';
import { UserPayload } from '../types';
import { jwtUserPayload } from '../types/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) return next(new UnauthorizedError())

  try {
    const accessToken = authorization!.split(' ')[1];
    req.user = (jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as jwtUserPayload).user;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new TokenExpired({ reason: err.message, expiredAt: err.expiredAt }))
    }
    return next(new UnauthorizedError())
  }
  return next();
};
