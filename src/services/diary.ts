import { FoodProperite, Interfood, Prisma } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { UserRepository, RefreshTokenRepository, InterFoodTypeRepository, InterFoodRepository, FoodProperiteRepository } from "../repositorys";
import { Utils } from "../utils";

@Service()
export default class DiaryService {
  constructor(
    @Inject('logger') private logger: Logger,
    // @Inject('utils') private myUtils: MyUtils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshToken: RefreshTokenRepository,
    @Inject('refreshToken') private interFoodType: InterFoodTypeRepository,
    @Inject('refreshToken') private interFood: InterFoodRepository,
    @Inject('refreshToken') private foodProperite: FoodProperiteRepository,
  ) {
  }

  async AddNewEntry(interFoodType: string, foodProp: Prisma.FoodProperiteCreateArgs) {
    try {
      // InterFoodTypeRepository
      const interFoodTypeResp = await this.interFoodType.add(interFoodType)
      // const interfood: Prisma.InterfoodCreateArgs = {
      //   data: {
      //     interfoodTypeId: interFoodTypeResp.id
      //   }
      // }
      const interFoodResp = this.interFood.add({
        data: {
          interfoodTypeId: interFoodTypeResp.id
        }
      })
      // const foodProperite: Prisma.FoodProperiteCreateArgs = {
      //   data: foodProp.data
      // }
      const foodProperiteResp = this.foodProperite.add(
        {
          data: foodProp.data
        }
      )

      return { success: true, message: 'sucsucsuc' }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async Test() {
    try {
      return { success: true, message: 'sucsucsuc' }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async Test1() {
    try {
      return { success: true, message: 'test1' }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}