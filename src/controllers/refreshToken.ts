import { NextFunction, Request, Response } from 'express';
import { addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById } from '../services/auth';
import { findUserById } from '../services/users';
import { v4 as uuidv4 } from 'uuid';
import { generateTokens } from '../utils/generateToken';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized';
import { MissingRefreshToken } from '../errors/missingRefreshToken';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new MissingRefreshToken()

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    const savedRefreshToken = await findRefreshTokenById(payload.jti!);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) throw new UnauthorizedError()

    const hashedToken = await Password.toHash(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) throw new UnauthorizedError()

    const user = await findUserById(payload.userId);
    if (!user) throw new UnauthorizedError()

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (e) {
    next(e)
  }
};

// // This endpoint is only for demo purpose.
// // Move this logic where you need to revoke the tokens( for ex, on password reset)
// router.post('/revokeRefreshTokens', async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     await revokeTokens(userId);
//     res.json({ message: `Tokens revoked for user with id #${userId}` });
//   } catch (err) {
//     next(err);
//   }
// });