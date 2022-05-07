import { Request, Response } from 'express';
import { addRefreshTokenToWhitelist } from '../services/auth';
import { findUserByEmail } from '../services/users';
import { Password, generateTokens, sendRefreshToken, uuidv4 } from '../utils';
import { BadRequest } from '../errors';

type User = {
  email: string;
  password: string;
};


export const logIn = async (req: Request, res: Response) => {
  try {
    const userWhoWantsToLogIn: User = req.body;

    const User = await findUserByEmail(userWhoWantsToLogIn.email);

    if (!User) {
      throw new BadRequest('Invalid login credentials.');
    }

    const validPassword = await Password.compare(User.password, userWhoWantsToLogIn.password);
    if (!validPassword) {
      throw new BadRequest('Invalid login credentials.');
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(User, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: User.id });

    sendRefreshToken(res, refreshToken);
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
