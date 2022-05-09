import { User } from "@prisma/client";
import { BadRequest } from "../errors";
import { findUserByEmail, addRefreshTokenToWhitelist } from "../repositorys";
import { Password, uuidv4, generateTokens, sendRefreshToken } from "../utils";
import { Service, Inject } from 'typedi';
import { Logger } from "winston";

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
    // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async LogIn(userWhoWantsToLogIn: User): Promise<any> {
    try {
      const User = await findUserByEmail(userWhoWantsToLogIn.email);

      if (!User) {
        throw new BadRequest('Invalid login credentials.');
      }

      const validPassword = await Password.compare(User.password, userWhoWantsToLogIn.password);
      if (!validPassword) {
        throw new BadRequest('Invalid login credentials.');
      }

      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(User, jti);
      await addRefreshTokenToWhitelist({ jti, refreshToken, userId: User.id });

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
    //     sendRefreshToken(res, refreshToken);
    //     res.json({
    //       accessToken,
    //       refreshToken
    //     });
    //   } catch (e) {
    //     let message;
    //     if (e instanceof Error) message = e.message;
    //     else message = String(e);
    //     res.status(400).json({ success: false, message });
    //   }
  }
}