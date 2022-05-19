import { Prisma } from "@prisma/client";

export interface InterfoodImport {
  userId?: string,
  foodName: string,
  foodPortion?: number,
  createdAt: Date,
  interFoodType: string,
  foodProp?: Prisma.FoodProperiteCreateInput
}