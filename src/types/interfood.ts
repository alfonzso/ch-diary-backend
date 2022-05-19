import { Prisma } from "@prisma/client";

export interface InterfoodImport {
  userId?: string,
  foodName: string,
  foodPortion?: number,
  createdAt: string,
  interFoodType: string,
  foodProp?: Prisma.FoodProperiteCreateInput
}