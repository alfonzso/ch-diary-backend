import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorized';
import jwt from 'jsonwebtoken';

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

export default async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.replace('Bearer ', '');
  }

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // const user = await prisma.user.findUnique({ where: {id: decoded.id}})

    const payload: UserPayload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    req.currentUser = payload;
    next();
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    res.status(400).json({ success: false, message });
  }
};
