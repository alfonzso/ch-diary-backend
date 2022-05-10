import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { UserRepository, RefreshTokenRepository } from "../repositorys";
import { MyUtils } from "../utils";

@Service()
export default class DiaryService {
  constructor(
    @Inject('logger') private logger: Logger,
    // @Inject('myUtils') private myUtils: MyUtils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshToken: RefreshTokenRepository,
  ) {
  }

  async Test() {
    try {
      return { success: true, message: 'sucsucsuc' }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async Test1() {
    try {
      return { success: true, message: 'test1' }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}