import { Request, Response } from 'express';
import { findUserByEmail, createUserByEmailAndPassword } from '../services/users';
import { addRefreshTokenToWhitelist } from '../services/auth';
import { BadRequest } from '../errors';
import { uuidv4, generateTokens, sendRefreshToken } from '../utils';

type User = {
  // id: string;
  email: string;
  password: string;
};


export const register = async (req: Request, res: Response) => {
  try {
    const userFromRequest: User = req.body;

    const existingUser = await findUserByEmail(userFromRequest.email);

    if (existingUser) {
      throw new BadRequest('Email already in use.');
    }

    const user = await createUserByEmailAndPassword(userFromRequest);
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    sendRefreshToken(res, refreshToken);

    res.status(201).json({
      success: true, data: {
        accessToken,
        refreshToken,
      }
    });
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    res.status(400).json({ success: false, message });
  }
};


