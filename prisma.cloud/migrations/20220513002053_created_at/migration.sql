/*
  Warnings:

  - You are about to drop the column `date` on the `ChDiary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_foodProperiteId_fkey";

-- AlterTable
ALTER TABLE "ChDiary" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_foodProperiteId_fkey" FOREIGN KEY ("foodProperiteId") REFERENCES "FoodProperite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
