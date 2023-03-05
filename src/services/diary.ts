import { ChDiary, Food, FoodProperite, Interfood, InterfoodType, Prisma, User } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { InterFoodTypeRepository, InterFoodRepository, FoodProperiteRepository, FoodRepository, ChDiaryRepository } from "../repositorys";
import { addNewEntry } from "../types";

@Service()
export default class DiaryService {
  constructor(
    @Inject('logger') private logger: Logger,
    private interFoodType: InterFoodTypeRepository,
    private interFood: InterFoodRepository,
    private foodProperite: FoodProperiteRepository,
    private food: FoodRepository,
    private chDiary: ChDiaryRepository,
  ) {
  }

  async addNewEntry({
    userDTO,
    foodName,
    foodPortion,
    createdAt,
    interFoodType,
    foodProp
  }: addNewEntry
  ) {
    try {
      if (interFoodType === undefined) interFoodType = "-"
      const interFoodTypeResp: InterfoodType = await this.interFoodType.add(interFoodType)

      const interFoodResp: Interfood = await this.interFood.add({
        data: {
          interfoodTypeId: interFoodTypeResp.id
        }
      })

      const foodProperiteResp: FoodProperite = await this.foodProperite.add(
        {
          data: {
            ...foodProp
          }
        }
      )

      const foodResp: Food = await this.food.add({
        data: {
          name: foodName,
          portion: foodPortion,
          interfoodId: interFoodResp.id,
          foodProperiteId: foodProperiteResp.id
        }
      })

      let diaryData: Prisma.ChDiaryCreateArgs = {
        data: {
          userId: userDTO.id!,
          foodId: foodResp.id
        }
      }

      if (createdAt !== undefined) diaryData.data.createdAt = createdAt

      const chDiaryResp: ChDiary = await this.chDiary.add(diaryData)

      return { success: true, db: chDiaryResp }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


  async getEntryByUserId({ id }: User) {
    try {
      const chDiaryResp = await this.chDiary.getUserAllFood(id)
      return { success: true, data: chDiaryResp }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getEntryByUserNickNameAndDate({ id }: User, date: Date) {
    try {
      const chDiaryResp = await this.chDiary.getUserFoodByDate(id, date)
      return { success: true, data: chDiaryResp }
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