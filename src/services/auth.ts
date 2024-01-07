// import 'reflect-metadata';

import { User } from "@prisma/client";
import { BadRequest, TokenExpired, UnauthorizedError } from "../errors";
import { RefreshTokenRepository, UserRepository } from "../repositorys";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import { Utils, uuidv4 } from "../utils";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { tokenManagerInstance } from "../utils/generateToken";
import { JWTUserPayload } from "../types/jwt";
// import { getEntry } from "../routes/diary";


type RenewResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
  refreshExp: number | undefined
} | null


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

  // public async TokenErrorHandler(err: jwt.VerifyErrors | null, refreshToken: string) {
  //   if (err instanceof TokenExpiredError) {
  //     await this.refreshTokenRepository.deleteRefreshToken((jwt.decode(refreshToken) as jwt.JwtPayload).jti!)
  //     throw new TokenExpired({ reason: err.message, expiredAt: err.expiredAt });
  //   }
  //   if (err instanceof UnauthorizedError) {
  //     // await this.refreshTokenRepository.deleteRefreshToken((jwt.decode(refreshToken) as jwt.JwtPayload).jti!)
  //     throw err;
  //   }
  //   if (err instanceof JsonWebTokenError) {
  //     throw new JsonWebTokenError(err.message);
  //   }
  //   console.log("[ERROR] Refresh jwt: ", err, refreshToken);
  //   throw new Error("Refresh jwt error !")
  // }

  public CleanUpRefreshToken(refreshToken:string){
    this.refreshTokenRepository.deleteRefreshToken((jwt.decode(refreshToken) as jwt.JwtPayload).jti!)
  }

  public VerifyToken(token: string) {
    return new Promise((
      resolve: (payload: string | JWTUserPayload | undefined) => void,
      reject: (error: jwt.VerifyErrors | null) => void
    ) => {
      try {
        // throw new Error("anyad")
        resolve(jwt.verify(token, process.env.JWT_REFRESH_SECRET!))
      } catch (error: any) {
        reject(error)
      }
    });
  }


  // RenewAccessFromRefresh
  public async RenewAccessFromRefresh(refreshToken: string): Promise<RenewResponse> {
    return this.VerifyToken(refreshToken)
      .then((payload) => {
        return this.RenewLogic(refreshToken, payload)
      })
    // )
    // .catch((err) => { this.TokenErrorHandler(err, refreshToken); return null })
  }

  public async RenewLogic(refreshToken: string, payload: string | JWTUserPayload | undefined): Promise<RenewResponse> {
    // return new Promise(async (
    //   // resolve: (payload: string | JWTUserPayload | undefined) => void,
    //   // reject: (error: jwt.VerifyErrors | null) => void
    // ) => {
      try {
        if (typeof payload == "string" || payload === undefined || payload.jti === undefined) return null

        const savedRefreshToken = await this.refreshTokenRepository.findRefreshTokenById(payload.jti);
        if (!savedRefreshToken || savedRefreshToken.revoked === true) throw new UnauthorizedError('refToken not exists or revoked')

        const validPassword = await this.utils.passwordManager.compare(savedRefreshToken.hashedToken, refreshToken);
        if (!validPassword) throw new UnauthorizedError('refTokens mismatch')

        const user = await this.userRepository.findUserById(payload.user?.id || "");
        if (!user) throw new UnauthorizedError('user not exists')

        // const jti = uuidv4();
        // const { accessToken, } = tokenManagerInstance.generateTokens(user, jti);
        const accessToken = tokenManagerInstance.generateAccessToken(user, payload.jti);

        return { accessToken, refreshToken, user, refreshExp: payload.exp }
      } catch (e) {
        return Promise.reject(e);
      }

    // })
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