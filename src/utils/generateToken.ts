import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

class TokenManager {

  generateAccessToken(user: User) {
    return jwt.sign({
      userId: user.id,
      userEmail: user.email,
      userNickName: user.nickname,
    }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '5m',
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
    }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '2d',
      // expiresIn: '15s',
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