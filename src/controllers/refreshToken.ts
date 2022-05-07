import { NextFunction, Request, Response } from 'express';
import { addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById } from '../services/auth';
import { findUserById } from '../services/users';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized';
import { MissingRefreshToken } from '../errors/missingRefreshToken';
import { Password, generateTokens, sendRefreshToken, uuidv4 } from '../utils';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(
      'refTok-->', req.cookies
    )
    const refreshToken: string = req.cookies.refresh_token;
    // const refreshToken = req.cookies;
    if (!refreshToken) throw new MissingRefreshToken()

    // const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    let payload: jwt.JwtPayload = {}

    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        await deleteRefreshToken((jwt.decode(refreshToken) as jwt.JwtPayload).jti!)
        throw new TokenExpiredError(err.message, err.expiredAt);
      }
    }

    const savedRefreshToken = await findRefreshTokenById(payload.jti!);
    if (!savedRefreshToken || savedRefreshToken.revoked === true) throw new UnauthorizedError('refToken not exists or revoked')

    const validPassword = await Password.compare(savedRefreshToken.hashedToken, refreshToken);
    if (!validPassword) throw new UnauthorizedError('refTokens mismatch')

    const user = await findUserById(payload.userId);
    if (!user) throw new UnauthorizedError('user not exists')

    // await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, ...vals } = generateTokens(user, jti);
    // const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    // await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    // sendRefreshToken(res, newRefreshToken);

    res.json({
      accessToken,
      refreshToken
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