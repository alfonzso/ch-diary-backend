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

// export const checkUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     throw new Error('Method not implemented.');
//     next();
//   } catch (e) {
//     let message;
//     if (e instanceof Error) message = e.message;
//     else message = String(e);
//     res.status(400).json({ success: false, message });
//   }
// };

// export const checkUsers = (
//   err: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (err instanceof CustomError) {
//     myLogger('Got some of customError: ', err.serializeErrors().message)
//     return res.status(err.statusCode).json({ error: err.serializeErrors() });
//   }

//   return res
//     .status(400)
//     .json({ errors: [{ message: err.message || 'Something Went Wrong' }] });
// };
