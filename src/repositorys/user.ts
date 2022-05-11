import { User } from "@prisma/client";
import { Inject, Service } from "typedi";
import { Utils } from "../utils";

@Service()
export default class UserRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) {
  }

  findUserByEmail(email: string) {
    return this.utils.prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUserByEmailAndPassword(user: User) {
    user.password = await this.utils.passwordManager.toHash(user.password);

    return this.utils.prismaClient.user.create({
      data: user,
    });
  }

  async deleteUserByEmail(email: string) {
    return this.utils.prismaClient.user.delete({
      where: {
        email,
      },
    });
  }

  findUserById(id: string) {
    return this.utils.prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }

}