import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { BadRequest, MissingRefreshToken, TokenExpired, UnauthorizedError } from "../errors";
import {
  findUserByEmail, createUserByEmailAndPassword, findUserById,
  addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById
} from "../repositorys";
import { uuidv4, generateTokens, sendRefreshToken, Password } from "../utils";

const register = async (req: Request, res: Response) => {
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

const logIn = async (req: Request, res: Response) => {
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

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken: string = req.cookies.refresh_token;
    if (!refreshToken) throw new MissingRefreshToken()

    let payload: jwt.JwtPayload = {}

    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        await deleteRefreshToken((jwt.decode(refreshToken) as jwt.JwtPayload).jti!)
        throw new TokenExpired({ reason: err.message, expiredAt: err.expiredAt });
      }
    }

    const savedRefreshToken = await findRefreshTokenById(payload.jti!);
    if (!savedRefreshToken || savedRefreshToken.revoked === true) throw new UnauthorizedError('refToken not exists or revoked')

    const validPassword = await Password.compare(savedRefreshToken.hashedToken, refreshToken);
    if (!validPassword) throw new UnauthorizedError('refTokens mismatch')

    const user = await findUserById(payload.userId);
    if (!user) throw new UnauthorizedError('user not exists')

    const jti = uuidv4();
    const { accessToken, } = generateTokens(user, jti);

    res.json({
      accessToken,
      refreshToken
    });
  } catch (e) {
    next(e)
  }
};

const authUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ success: true, data: req.payload });
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    res.status(400).json({ success: false, message });
  }
};

export {
  register,
  logIn,
  refreshToken,
  authUser,
}