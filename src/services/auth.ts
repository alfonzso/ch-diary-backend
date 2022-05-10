import { User } from "@prisma/client";
import { BadRequest, TokenExpired, UnauthorizedError } from "../errors";
import { RefreshTokenRepository, UserRepository, userRepositoryInstance } from "../repositorys";
// import { passwordInstance, uuidv4, generateTokens, sendRefreshToken, Password } from "../utils";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import myLogger from "../utils/myLogger";
import { MyUtils, Password, uuidv4 } from "../utils";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { myJWTInstance } from "../utils/generateToken";
import { passwordInstance } from "../utils/password";

// class BaseService {
//   // constructor(parameters) {

//   // }
//   public async catchHandler(e: Error) {
//     let message;
//     if (e instanceof Error) message = e.message;
//     else message = String(e);
//     return { success: false, message }
//   }
// }

@Service()
export default class AuthService {
  constructor(
    @Inject('logger') private logger: Logger,
    @Inject('myUtils') private myUtils: MyUtils,
    @Inject('userRepository') private userRepository: UserRepository,
    @Inject('refreshToken') private refreshToken: RefreshTokenRepository,
  ) {
  }

  public async LogIn(userDTO: User): Promise<any> {
    try {
      myLogger('Login -> userDTO: ', userDTO)
      const User = await this.userRepository.findUserByEmail(userDTO.email);

      if (!User) {
        throw new BadRequest('Invalid login credentials.');
      }

      // const validPassword = await Password.compare(User.password, userWhoWantsToLogIn.password);
      const validPassword = await this.myUtils.password.compare(User.password, userDTO.password);
      if (!validPassword) {
        throw new BadRequest('Invalid login credentials.');
      }

      const jti = uuidv4();
      const { accessToken, refreshToken } = this.myUtils.myJWT.generateTokens(User, jti);
      await this.refreshToken.addRefreshTokenToWhitelist({ jti, refreshToken, userId: User.id });
      return [accessToken, refreshToken]

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async Register(userDTO: User): Promise<any> {
    try {
      const existingUser = await userRepositoryInstance.findUserByEmail(userDTO.email);

      if (existingUser) {
        throw new BadRequest('Email already in use.');
      }

      const user = await userRepositoryInstance.createUserByEmailAndPassword(userDTO);
      const jti = uuidv4();
      const { accessToken, refreshToken } = this.myUtils.myJWT.generateTokens(user, jti);
      await this.refreshToken.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
      return [accessToken, refreshToken]

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async RefreshToken(refreshToken: string): Promise<any> {
    try {

      let payload: jwt.JwtPayload = {}

      try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          await this.refreshToken.deleteRefreshToken((jwt.decode(refreshToken) as jwt.JwtPayload).jti!)
          throw new TokenExpired({ reason: err.message, expiredAt: err.expiredAt });
        }
      }

      const savedRefreshToken = await this.refreshToken.findRefreshTokenById(payload.jti!);
      if (!savedRefreshToken || savedRefreshToken.revoked === true) throw new UnauthorizedError('refToken not exists or revoked')

      const validPassword = await passwordInstance.compare(savedRefreshToken.hashedToken, refreshToken);
      if (!validPassword) throw new UnauthorizedError('refTokens mismatch')

      const user = await userRepositoryInstance.findUserById(payload.userId);
      if (!user) throw new UnauthorizedError('user not exists')

      const jti = uuidv4();
      const { accessToken, } = myJWTInstance.generateTokens(user, jti);

      return accessToken

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async AuthUser(): Promise<any> {
    try {

      return true

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}