// import 'reflect-metadata';

import { User } from "@prisma/client";
import { BadRequest, TokenExpired, UnauthorizedError } from "../errors";
import { RefreshTokenRepository, UserRepository } from "../repositorys";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import { Utils, uuidv4 } from "../utils";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { tokenManagerInstance } from "../utils/generateToken";
import { getEntry } from "../routes/diary";

@Service()
export default class AuthService {
  constructor(
    @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {
  }

  public async LogIn(userDTO: User): Promise<[string, string]> {
    try {
      // this.myUtils.logger('Login -> userDTO: ', userDTO)
      const User = await this.userRepository.findUserByNickName(userDTO.nickname);

      if (!User) {
        throw new BadRequest('Invalid login credentials.');
      }

      const validPassword = await this.utils.passwordManager.compare(User.password, userDTO.password);
      if (!validPassword) {
        throw new BadRequest('Invalid login credentials.');
      }

      const jti = uuidv4();
      const { accessToken, refreshToken } = this.utils.tokenManager.generateTokens(User, jti);
      await this.refreshTokenRepository.addRefreshTokenToWhitelist({ jti, refreshToken, userId: User.id });
      return [accessToken, refreshToken]

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async Register(userDTO: User): Promise<[string, string]> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(userDTO.email);

      if (existingUser) {
        throw new BadRequest('Email already in use.');
      }

      const user = await this.userRepository.createUserByEmailAndPassword(userDTO);
      const jti = uuidv4();
      const { accessToken, refreshToken } = this.utils.tokenManager.generateTokens(user, jti);
      await this.refreshTokenRepository.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
      return [accessToken, refreshToken]

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async RefreshToken(refreshToken: string): Promise<
    { accessToken: string; refreshToken: string; user: User; refreshExp: number | undefined }
  > {
    try {
      let payload: jwt.JwtPayload = {}

      try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
      } catch (err) {
        console.log(err)
        if (err instanceof TokenExpiredError) {
          await this.refreshTokenRepository.deleteRefreshToken((jwt.decode(refreshToken) as jwt.JwtPayload).jti!)
          throw new TokenExpired({ reason: err.message, expiredAt: err.expiredAt });
        }
        if (err instanceof JsonWebTokenError) {
          throw new JsonWebTokenError(err.message);
        }
        throw new Error("Refresh jwt error !")
      }

      const savedRefreshToken = await this.refreshTokenRepository.findRefreshTokenById(payload.jti!);
      if (!savedRefreshToken || savedRefreshToken.revoked === true) throw new UnauthorizedError('refToken not exists or revoked')

      const validPassword = await this.utils.passwordManager.compare(savedRefreshToken.hashedToken, refreshToken);
      if (!validPassword) throw new UnauthorizedError('refTokens mismatch')

      const user = await this.userRepository.findUserById(payload.userId);
      if (!user) throw new UnauthorizedError('user not exists')

      const jti = uuidv4();
      const { accessToken, } = tokenManagerInstance.generateTokens(user, jti);

      return { accessToken, refreshToken, user, refreshExp: payload.exp }
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