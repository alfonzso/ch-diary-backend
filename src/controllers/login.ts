import { Request, Response } from 'express';
import { BadRequestError } from '../errors/badRequestError';
import { addRefreshTokenToWhitelist } from '../services/auth';
import { findUserByEmail } from '../services/users';
import { v4 as uuidv4 } from 'uuid';
import { generateTokens } from '../utils/generateToken';
import { Password } from '../utils/password';

type User = {
  email: string;
  password: string;
};


export const logIn = async (req: Request, res: Response) => {
  try {
    const userWhoWantsToLogIn: User = req.body;

    const User = await findUserByEmail(userWhoWantsToLogIn.email);

    if (!User) {
      throw new BadRequestError('Invalid login credentials.');
    }

    const validPassword = await Password.compare(User.password, userWhoWantsToLogIn.password);
    if (!validPassword) {
      throw new BadRequestError('Invalid login credentials.');
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(User, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: User.id });

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
