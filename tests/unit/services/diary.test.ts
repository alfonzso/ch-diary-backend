import 'reflect-metadata'
import { AuthService, DiaryService } from "../../../src/services";
import { Utils, utilsInstance } from "../../../src/utils";
import { ChDiaryRepository, FoodProperiteRepository, FoodRepository, InterFoodRepository, InterFoodTypeRepository, RefreshTokenRepository, UserRepository } from "../../../src/repositorys";
import LoggerInstance from '../../../src/loaders/logger';
import jwt from "jsonwebtoken";
import Container from 'typedi';
import dependencyInjectorLoader from '../../../src/loaders/dependencyInjector';
import { Prisma, User } from '@prisma/client';
import { IUser } from '../../../src/types';

describe('User', () => {
  describe('RefreshToken', () => {
    test('Should user refresh his/her accessToken', async () => {

      dependencyInjectorLoader()
      const interFoodType = Container.get(InterFoodTypeRepository)
      const interFood = Container.get(InterFoodRepository)
      const foodProperite = Container.get(FoodProperiteRepository)
      const food = Container.get(FoodRepository)
      const chDiary = Container.get(ChDiaryRepository)

      const userDTO: IUser = {
        id: "fafa",
        email: "foo@bar.com",
        password: "fefe"
      }

      const userService = new DiaryService(
        LoggerInstance,
        interFoodType,
        interFood,
        foodProperite,
        food,
        chDiary,
      );

      const foodProp: Prisma.FoodProperiteCreateInput = {
        // data: {
        ch: 100,
        fat: 100,
        gramm: 100,
        kcal: 100,
        portein: 100,
        // }
      }

      const userRecord = await userService.addNewEntry({
        userDTO: userDTO,
        foodName: "foodName",
        foodPortion: 450,
        createdAt: new Date("2022-05-05"),
        interFoodType: "D7",
        foodProp: foodProp
      });

      // expect(refreshTokenRepositoryMock).toHaveBeenCalledTimes(1);
      // expect(refreshTokenRepositoryMock).toReturnWith(mockedRefToken)

      // expect(userRepoFindUserByIdMock).toHaveBeenCalledTimes(1);
      // expect(userRepoFindUserByIdMock).toReturnWith(mockedUser)

      // expect(jwtVerifyMock).toHaveBeenCalledTimes(1);
      // expect(jwtVerifyMock).toReturnWith({
      //   userId: "1bbd258b-4599-4406-bbc3-9a2ad569fbae",
      //   jti: '2065db60-f4e0-431b-871c-ebb784a41f55'
      // })

      // expect(userRecord.length).not.toEqual(0)

    });
  })
})
