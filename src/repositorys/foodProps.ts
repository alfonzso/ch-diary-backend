import { Prisma } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Utils } from "../utils";

@Service()
export default class FoodPropertyRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async add({ data }: Prisma.FoodPropertyCreateArgs) {
    return this.utils.prismaClient.foodProperty.create({
      data
    })
  }
  public async getById(id: string) {
    return this.utils.prismaClient.foodProperty.findUnique({
      where: {
        id,
      },
    })
  }
}

