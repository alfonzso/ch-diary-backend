import { Prisma } from "@prisma/client";

export interface addNewEntry {
  userDTO: Prisma.UserCreateArgs,
  foodName: string,
  foodPortion: number,
  date?: Date,
  interFoodType?: string,
  foodProp: Prisma.FoodProperiteCreateArgs
}