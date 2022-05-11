import 'reflect-metadata';

// import { User } from "@prisma/client";
// import { BadRequest, TokenExpired, UnauthorizedError } from "../errors";
import { RefreshTokenRepository, UserRepository, userRepositoryInstance } from "../repositorys";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";
// import { MyUtils, uuidv4 } from "../utils";
// import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
// import { myJWTInstance } from "../utils/generateToken";

@Service()
export default class UserService {
  constructor(
    @Inject('logger') private logger: Logger,
    // @Inject('myUtils') private myUtils: MyUtils,
    @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async DeletUser(email: string): Promise<boolean> {
    try {

      await this.userRepository.deleteUserByEmail(email)
      return true

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}