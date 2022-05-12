import { Interfood } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Utils } from "../utils";

@Service()
export default class InterFoodRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async add(interFood: Interfood) {
    return this.utils.prismaClient.interfood.create({
      data: interFood
    })
  }
  // public async get(type: string) {
  //   return this.utils.prismaClient.interfood.({
  //     data: {
  //       foodType: type,
  //     },
  //   })
  // }
}

