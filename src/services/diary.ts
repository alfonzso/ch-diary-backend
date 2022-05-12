import { FoodProperite, Interfood, Prisma, User } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { UserRepository, RefreshTokenRepository, InterFoodTypeRepository, InterFoodRepository, FoodProperiteRepository, FoodRepository, ChDiaryRepository } from "../repositorys";
import { Utils } from "../utils";

@Service()
export default class DiaryService {
  constructor(
    @Inject('logger') private logger: Logger,
    // @Inject('utils') private myUtils: MyUtils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshToken: RefreshTokenRepository,
    @Inject('interFoodType') private interFoodType: InterFoodTypeRepository,
    @Inject('interFood') private interFood: InterFoodRepository,
    @Inject('foodProperite') private foodProperite: FoodProperiteRepository,
    @Inject('food') private food: FoodRepository,
    @Inject('chDiary') private chDiary: ChDiaryRepository,
  ) {
  }

  async AddNewEntry(
    userDTO: User,
    date: Date,
    interFoodType: string,
    foodProp: Prisma.FoodProperiteCreateArgs
  ) {
    try {
      // InterFoodTypeRepository
      const interFoodTypeResp = await this.interFoodType.add(interFoodType)
      // const interfood: Prisma.InterfoodCreateArgs = {
      //   data: {
      //     interfoodTypeId: interFoodTypeResp.id
      //   }
      // }
      const interFoodResp = await this.interFood.add({
        data: {
          interfoodTypeId: interFoodTypeResp.id
        }
      })
      // const foodProperite: Prisma.FoodProperiteCreateArgs = {
      //   data: foodProp.data
      // }
      const foodProperiteResp = await this.foodProperite.add(
        {
          data: foodProp.data
        }
      )

      const foodResp = await this.food.add({
        data: {
          name: "fafa",
          portion: 450,
          interfoodId: interFoodResp.id,
          foodProperiteId: foodProperiteResp.id
        }
      })

      const chDiaryResp = await this.chDiary.add({
        data: {
          // User: userDTO,
          userId: userDTO.id,
          date: date,
          foodId: foodResp.id
        }
      })


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