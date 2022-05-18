import 'reflect-metadata';

import { UserRepository } from "../repositorys";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import { User } from '@prisma/client';

@Service()
export default class UserService {
  constructor(
    @Inject('logger') private logger: Logger,
    // @Inject('utils') private myUtils: MyUtils,
    private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async GetUser(email: string)  {
    try {
      return await this.userRepository.findUserByEmail(email)
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
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