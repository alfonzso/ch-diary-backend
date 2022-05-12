import { Food, Prisma } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Utils } from "../utils";

@Service()
export default class FoodRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async add({ data }: Prisma.FoodCreateArgs) {
    return this.utils.prismaClient.food.create({
      data
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

