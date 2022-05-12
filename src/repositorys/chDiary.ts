import { ChDiary, Prisma } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Utils } from "../utils";

@Service()
export default class ChDiaryRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async add({ data }: Prisma.ChDiaryCreateArgs) {
    return this.utils.prismaClient.chDiary.create({
      data
    })
  }
  public async getUserAllFood(userId: string) {
    return this.utils.prismaClient.chDiary.findMany({
      where: {
        userId
      },
    })
  }
  public async getUserFoodByDate(userId: string, date: Date) {
    return this.utils.prismaClient.chDiary.findMany({
      where: {
        userId,
        date
      },
    })
  }
}

