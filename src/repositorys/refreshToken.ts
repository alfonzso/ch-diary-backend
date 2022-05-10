// import { refreshToken } from "../controllers";
import { myUtilsInstance } from "../utils";

// import { passwordInstance, db } from "../utils";
const db = myUtilsInstance.prismaClient
// const jwtInstance = myUtilsInstance.myJWT
const passwordInstance = myUtilsInstance.password

type RefreshToken = {
  jti: any;
  refreshToken: string;
  userId: any;
};

class RefreshTokenRepository {

  // used when we create a refresh token.
  public async addRefreshTokenToWhitelist({ jti, refreshToken, userId }: RefreshToken) {
    return db.refreshToken.create({
      data: {
        id: jti,
        hashedToken: await passwordInstance.toHash(refreshToken),
        userId
      },
    });
  }

  // used to check if the token sent by the client is in the database.
  public findRefreshTokenById(id: string) {
    return db.refreshToken.findUnique({
      where: {
        id,
      },
    });
  }

  // soft delete tokens after usage.
  public deleteRefreshToken(id: string) {
    return db.refreshToken.update({
      where: {
        id,
      },
      data: {
        revoked: true
      }
    });
  }

  public revokeTokens(userId: any) {
    return db.refreshToken.updateMany({
      where: {
        userId
      },
      data: {
        revoked: true
      }
    });
  }
}

const refreshTokenInstance = new RefreshTokenRepository()
export {
  RefreshTokenRepository,
  refreshTokenInstance
  // addRefreshTokenToWhitelist,
  // findRefreshTokenById,
  // deleteRefreshToken,
  // revokeTokens
};