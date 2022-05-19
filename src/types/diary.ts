import { Prisma } from "@prisma/client";

export interface IUser {
  id: string
  email?: string
  password?: string
}

export interface addNewEntry {
  userDTO: IUser,
  foodName: string,
  foodPortion: number,
  createdAt?: Date,
  interFoodType?: string,
  foodProp: Prisma.FoodProperiteCreateInput
}