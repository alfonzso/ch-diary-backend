import { Inject, Service } from "typedi";
import { Utils } from "../utils";

type RefreshToken = {
  jti: any;
  refreshToken: string;
  userId: any;
};

@Service()
export default class RefreshTokenRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) {
  }

  // used when we create a refresh token.
  public async addRefreshTokenToWhitelist({ jti, refreshToken, userId }: RefreshToken) {
    return this.utils.prismaClient.refreshToken.create({
      data: {
        id: jti,
        hashedToken: await this.utils.passwordManager.toHash(refreshToken),
        userId
      },
    });
  }

  // used to check if the token sent by the client is in the database.
  public findRefreshTokenById(id: string) {
    return this.utils.prismaClient.refreshToken.findUnique({
      where: {
        id,
      },
    });
  }

  // soft delete tokens after usage.
  public deleteRefreshToken(id: string) {
    return this.utils.prismaClient.refreshToken.update({
      where: {
        id,
      },
      data: {
        revoked: true
      }
    });
  }

  public revokeTokens(userId: any) {
    return this.utils.prismaClient.refreshToken.updateMany({
      where: {
        userId
      },
      data: {
        revoked: true
      }
    });
  }
}

// const refreshTokenRepositoryInstance = new RefreshTokenRepository()
// export {
//   RefreshTokenRepository,
//   // refreshTokenRepositoryInstance
// };