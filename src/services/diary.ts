import { FoodProperite, Interfood, Prisma, User } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { BadRequest, InvalidRequestParameters } from "../errors";
import { UserRepository, RefreshTokenRepository, InterFoodTypeRepository, InterFoodRepository, FoodProperiteRepository, FoodRepository, ChDiaryRepository } from "../repositorys";
import { addNewEntry, IUser } from "../types";
import { Utils } from "../utils";

@Service()
export default class DiaryService {
  constructor(
    @Inject('logger') private logger: Logger,
    // @Inject('utils') private myUtils: MyUtils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshToken: RefreshTokenRepository,
    // @Inject('interFoodType') private interFoodType: InterFoodTypeRepository,
    // @Inject('interFood') private interFood: InterFoodRepository,
    // @Inject('foodProperite') private foodProperite: FoodProperiteRepository,
    // @Inject('food') private food: FoodRepository,
    // @Inject('chDiary') private chDiary: ChDiaryRepository,
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
      // InterFoodTypeRepository
      // if (userDTO === undefined) date =
      if (interFoodType === undefined) interFoodType = "-"
      const interFoodTypeResp = await this.interFoodType.add(interFoodType)

      const interFoodResp = await this.interFood.add({
        data: {
          interfoodTypeId: interFoodTypeResp.id
        }
      })

      const foodProperiteResp = await this.foodProperite.add(
        {
          data: {
            ...foodProp
          }
        }
      )

      const foodResp = await this.food.add({
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


      const chDiaryResp = await this.chDiary.add(diaryData)

      return { success: true, message: 'sucsucsuc', db: chDiaryResp }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


  async getEntryByUserId({ id }: IUser) {
    try {
      if (id===undefined) throw new BadRequest('Id was undefined')
      const chDiaryResp = await this.chDiary.getUserAllFood(id)
      return { success: true, data: chDiaryResp }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getEntryByUserIdAndDate({ id }: IUser, date: Date) {
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