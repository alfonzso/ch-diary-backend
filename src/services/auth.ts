import { User } from "@prisma/client";
import { BadRequest } from "../errors";
import { findUserByEmail, addRefreshTokenToWhitelist } from "../repositorys";
import { Password, uuidv4, generateTokens, sendRefreshToken } from "../utils";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import myLogger from "../utils/myLogger";

class BaseService {
  // constructor(parameters) {

  // }
  public async catchHandler(e: Error) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    return { success: false, message }
  }
}

@Service()
export default class AuthService {
  constructor(
    // @Inject('userModel') private userModel: Models.UserModel,
    // private mailer: MailerService,
    @Inject('logger') private logger: Logger,
    @Inject('passwordManager') private password: Password,
    // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async LogIn(userDTO: User): Promise<any> {
    try {
      myLogger('userDTO: ', userDTO)
      const User = await findUserByEmail(userDTO.email);

      if (!User) {
        throw new BadRequest('Invalid login credentials.');
      }

      // const validPassword = await Password.compare(User.password, userWhoWantsToLogIn.password);
      const validPassword = await this.password.compare(User.password, userDTO.password);
      if (!validPassword) {
        throw new BadRequest('Invalid login credentials.');
      }

      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(User, jti);
      await addRefreshTokenToWhitelist({ jti, refreshToken, userId: User.id });
      return [accessToken, refreshToken]

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}