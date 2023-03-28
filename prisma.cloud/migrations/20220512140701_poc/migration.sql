/*
  Warnings:

  - You are about to drop the column `chDiaryId` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `FoodProperite` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `Interfood` table. All the data in the column will be lost.
  - You are about to drop the column `chDiaryId` on the `User` table. All the data in the column will be lost.
  - Added the required column `foodId` to the `ChDiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ChDiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodProperiteId` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interfoodId` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interfoodTypeId` to the `Interfood` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_chDiaryId_fkey";

-- DropForeignKey
ALTER TABLE "FoodProperite" DROP CONSTRAINT "FoodProperite_foodId_fkey";

-- DropForeignKey
ALTER TABLE "Interfood" DROP CONSTRAINT "Interfood_foodId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chDiaryId_fkey";

-- AlterTable
ALTER TABLE "ChDiary" ADD COLUMN     "foodId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "chDiaryId",
ADD COLUMN     "foodProperiteId" TEXT NOT NULL,
ADD COLUMN     "interfoodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FoodProperite" DROP COLUMN "foodId";

-- AlterTable
ALTER TABLE "Interfood" DROP COLUMN "foodId",
ADD COLUMN     "interfoodTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chDiaryId";

-- AddForeignKey
ALTER TABLE "Interfood" ADD CONSTRAINT "Interfood_interfoodTypeId_fkey" FOREIGN KEY ("interfoodTypeId") REFERENCES "InterfoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_interfoodId_fkey" FOREIGN KEY ("interfoodId") REFERENCES "Interfood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_foodProperiteId_fkey" FOREIGN KEY ("foodProperiteId") REFERENCES "FoodProperite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChDiary" ADD CONSTRAINT "ChDiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChDiary" ADD CONSTRAINT "ChDiary_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
