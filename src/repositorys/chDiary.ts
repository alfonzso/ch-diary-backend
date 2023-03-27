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
      select: {
        id: true,
        userId: false,
        createdAt: true,
        User: {
          select: {
            nickname: true,
            email: true
          }
        },
        Food: {
          select: {
            name: true,
            portion: true,
            FoodProperty: {
              select: {
                gramm: true,
                energy: true,
                protein: true,
                fat: true,
                ch: true,
              }
            },
            Interfood: {
              select: {
                InterfoodType: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }
  public async getUserFoodByDate(userId: string, createdAt: Date) {
    const tomorow = new Date(createdAt)
    tomorow.setDate(new Date(tomorow).getDate() + 1)
    return this.utils.prismaClient.chDiary.findMany({
      where: {
        userId,
        createdAt: {
          gte: createdAt,
          lt: tomorow
        }
      },
      select: {
        id: true,
        createdAt: true,
        userId: false,
        User: {
          select: {
            email: true
          }
        },
        Food: {
          select: {
            name: true,
            portion: true,
            FoodProperty: {
              select: {
                gramm: true,
                energy: true,
                protein: true,
                fat: true,
                ch: true,
              }
            },
            Interfood: {
              select: {
                InterfoodType: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }
}

