import { Request, Response } from 'express';
import { BadRequestError } from '../errors/badRequestError';
import { addRefreshTokenToWhitelist } from '../services/auth';
import { findUserByEmail } from '../services/users';
// import db from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { generateTokens } from '../utils/generateToken';
import { Password } from '../utils/password';
// import generateToken from '../utils/generateToken';

type User = {
  // id: string;
  email: string;
  password: string;
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const userFromRequest: User = req.body;

    const existingUser = await findUserByEmail(userFromRequest.email);

    if (!existingUser) {
      throw new BadRequestError('Invalid login credentials.');
    }

    const validPassword = await Password.compare(userFromRequest.password, existingUser.password);
    if (!validPassword) {
      throw new BadRequestError('Invalid login credentials.');
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken
    });
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    res.status(400).json({ success: false, message });
  }
};
