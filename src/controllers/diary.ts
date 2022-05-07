import { NextFunction, Request, Response } from 'express';
import { addRefreshTokenToWhitelist } from '../services/auth';
import { findUserByEmail } from '../services/users';
import { Password, generateTokens, sendRefreshToken, uuidv4 } from '../utils';
import { BadRequest } from '../errors';

export const test = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, message: 'sucsucsuc' });
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    res.status(400).json({ success: false, message });
  }
};

export const test1 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, message: 'test1' });
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    res.status(400).json({ success: false, message });
  }
};
