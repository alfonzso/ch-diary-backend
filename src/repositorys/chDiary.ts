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
            FoodProperite: {
              select: {
                gramm: true,
                kcal: true,
                portein: true,
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
      // include: {
      //   // userId: false,
      //   // posts: true,

      //   User: {
      //     select: {
      //       email: true
      //     }
      //   },
      //   Food: {
      //     include: {
      //       FoodProperite: true,
      //       Interfood: {
      //         include: {
      //           InterfoodType: true
      //         }
      //       }
      //     }
      //   },
      //   // User: true,
      // },
    })
  }
  public async getUserFoodByDate(userId: string, createdAt: Date) {
    return this.utils.prismaClient.chDiary.findMany({
      where: {
        userId,
        createdAt
      },
      select: {
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
            FoodProperite: {
              select: {
                gramm: true,
                kcal: true,
                portein: true,
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

