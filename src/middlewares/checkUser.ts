import { NextFunction, Request, Response } from 'express';

type UserPayload = {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}


export const checkUsers = function (
  req: Request, res: Response, next: NextFunction
) {
  console.log('LOGGED')
  next()
}