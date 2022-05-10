import { User } from "@prisma/client";
import { BadRequest } from "../errors";
import { addRefreshTokenToWhitelist, UserRepository, userRepositoryInstance } from "../repositorys";
// import { passwordInstance, uuidv4, generateTokens, sendRefreshToken, Password } from "../utils";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import myLogger from "../utils/myLogger";
import { MyUtils, Password, uuidv4 } from "../utils";

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
    // @Inject('userModel') private userModel: Models.UserModel,
    // private mailer: MailerService,
    @Inject('logger') private logger: Logger,
    // @Inject('passwordManager') private password: Password,
    @Inject('userRepository') private userRepository: UserRepository,
    @Inject('myUtils') private myUtils: MyUtils,
    // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async LogIn(userDTO: User): Promise<any> {
    try {
      myLogger('userDTO: ', userDTO)
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
      await addRefreshTokenToWhitelist({ jti, refreshToken, userId: User.id });
      return [accessToken, refreshToken]

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}