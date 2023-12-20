import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CustomError, TokenExpired, UnauthorizedError } from '../errors';
import { UserPayload } from '../types';
import { jwtUserPayload } from '../types/jwt';
import Container from 'typedi';
import AuthService from '../services/auth';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      decoded?: {
        // user?: UserPayload;
        // accessToken?: string;
        // exp: number | undefined;
        accessToken: string;
        refreshToken: string;
        user: UserPayload;
        refreshExp: number | undefined;
      }
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

export const refreshToAccess = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken: string = req.cookies.refresh_token;

  if (refreshToken === undefined || refreshToken.length < 0) {
    console.log("no token");
    return next();
  }

  try {
    let data = await Container.get(AuthService).RenewToken(refreshToken)
    req.decoded = { ...data }
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      console.log(err.message);
      console.log(err.reason);
    }
    res.clearCookie("refresh_token");
    res.setHeader("HX-Redirect", "/")
  }

  return next();
};
