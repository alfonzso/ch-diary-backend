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

export const checkUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('Method not implemented.');
    next();
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    res.status(400).json({ success: false, message });
  }
};
