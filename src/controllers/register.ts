import db from '../utils/db';
import { Request, Response } from 'express';
// import { Password } from '../utils/password';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../errors/badRequestError';
// import generateToken from '../utils/generateToken';

import { findUserByEmail, createUserByEmailAndPassword } from '../services/users';
import { addRefreshTokenToWhitelist } from '../services/auth';
import { generateTokens } from '../utils/generateToken';

type User = {
  // id: string;
  email: string;
  password: string;
};


export const register = async (req: Request, res: Response) => {
  try {
    const userFromRequest: User = req.body;

    // const userExists = await db.user.findUnique({
    //   where: { email },
    // });

    // if (userExists) {
    //   throw new BadRequestError('Email already in use');
    // }

    const existingUser = await findUserByEmail(userFromRequest.email);

    if (existingUser) {
      throw new BadRequestError('Email already in use.');
    }

    const user = await createUserByEmailAndPassword(userFromRequest);
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });


    // // let's hash password before we save to our db
    // const hash = await Password.toHash(enteredPassword);

    // const user = await db.user.create({
    //   data: {
    //     email,
    //     password: hash,
    //   },
    // });

    // // let's format this to return what we want, you can choose to return what you want
    // const { password, createdAt, updatedAt, ...newUser } = user;

    // const token = generateToken(user);

    // res.status(201).json({ success: true, data: { ...newUser, token } });
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


