import 'reflect-metadata'
import { AuthService, DiaryService } from "../../../src/services";
import { Utils, utilsInstance } from "../../../src/utils";
import { ChDiaryRepository, FoodPropertyRepository, FoodRepository, InterFoodRepository, InterFoodTypeRepository, RefreshTokenRepository, UserRepository } from "../../../src/repositorys";
import LoggerInstance from '../../../src/loaders/logger';
import jwt from "jsonwebtoken";
import Container from 'typedi';
import dependencyInjectorLoader from '../../../src/loaders/dependencyInjector';
import { Prisma, User } from '@prisma/client';
import { IUser } from '../../../src/types';

describe('User', () => {
  describe('Add new entry to chdiary', () => {
    test('Should success', async () => {

      dependencyInjectorLoader()
      const interFoodType = Container.get(InterFoodTypeRepository)
      const interFood = Container.get(InterFoodRepository)
      const foodProperite = Container.get(FoodPropertyRepository)
      const food = Container.get(FoodRepository)
      const chDiary = Container.get(ChDiaryRepository)

      const tabelToJsonConvertUrl = jest
        .spyOn(interFoodType, 'add')
        .mockImplementation((name: string): any => {
          return {
            id: "1",
            name: "D999"
          }
        });

      const fef = jest
        .spyOn(interFood, 'add')
        .mockImplementation((): any => {
          return {
            id: "1",
            interfoodTypeId: "1"
          }
        });

      const faf = jest
        .spyOn(foodProperite, 'add')
        .mockImplementation((): any => {
          return {
            id: "1",
            ch: 100,
            fat: 100,
            gramm: 100,
            kcal: 100,
            portein: 100,
          }
        });

      const efe = jest
        .spyOn(food, 'add')
        .mockImplementation((): any => {
          return {
            id: "1",
            name: "foodName",
            portion: 450,
            foodProperiteId: "1",
            interfoodId: "1",
          }
        });

      const rere = jest
        .spyOn(chDiary, 'add')
        .mockImplementation((): any => {
          return {
            id: "1",
            createdAt: new Date("2022-05-05"),
            userId: "1",
            foodId: "1",
          }
        });

      const userDTO: IUser = {
        id: "1",
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

      const foodProp: Prisma.FoodPropertyCreateInput = {
        ch: 100,
        fat: 100,
        gramm: 100,
        energy: 100,
        protein: 100,
      }

      const newEntry = await userService.addNewEntry({
        userDTO: userDTO,
        foodName: "foodName",
        foodPortion: 450,
        createdAt: new Date("2022-05-05"),
        interFoodType: "D7",
        foodProp: foodProp
      });

      expect(newEntry).toEqual({
        success: true,
        // message: 'sucsucsuc',
        db: {
          id: '1',
          createdAt: new Date("2022-05-05"),
          userId: '1',
          foodId: '1'
        }
      })

    });
  })
})
