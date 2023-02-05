import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { jwtUserPayload } from '../types/jwt';

class TokenManager {

  generateAccessToken(usr: User) {
    const userData: jwtUserPayload = {
      user: {
        id: usr.id,
        email: usr.email,
        nickname: usr.nickname
      }
    }
    return jwt.sign({ user: userData.user }, config.jwtAccessToken, {
      expiresIn: config.jwtAccessTokenExpIn,
      // expiresIn: '5s',
    });
  }

  // I choosed 8h because i prefer to make the user login again each day.
  // But keep him logged in if he is using the app.
  // You can change this value depending on your app logic.
  // I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
  generateRefreshToken(user: User, jti: string) {
    return jwt.sign({
      userId: user.id,
      jti
    }, config.jwtRefreshToken, {
      expiresIn: config.jwtRefreshTokenExpIn,
      // expiresIn: '15s',
      // expiresIn: '10m',
    });
  }

  generateTokens(user: User, jti: string): { accessToken: string; refreshToken: string; } {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, jti);

    return {
      accessToken,
      refreshToken,
    };

  }

}

const tokenManagerInstance = new TokenManager()
export {
  TokenManager,
  tokenManagerInstance
};