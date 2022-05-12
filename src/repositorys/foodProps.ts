import { FoodProperite, Prisma } from "@prisma/client";
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

  public async add({ data }: Prisma.FoodProperiteCreateArgs) {
    return this.utils.prismaClient.foodProperite.create({
      data
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

