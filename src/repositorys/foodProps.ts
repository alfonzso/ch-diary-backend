import { FoodProperite } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Utils } from "../utils";

@Service()
export default class FoodProperiteRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async add(foodProps: FoodProperite) {
    return this.utils.prismaClient.foodProperite.create({
      data: foodProps
    })
  }
  public async getById(id: string) {
    return this.utils.prismaClient.foodProperite.findUnique({
      where: {
        id,
      },
    })
  }
}

