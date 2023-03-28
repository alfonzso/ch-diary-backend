/*
  Warnings:

  - You are about to drop the column `foodProperiteId` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the `FoodProperite` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `foodPropertyId` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_foodProperiteId_fkey";

-- AlterTable
-- ALTER TABLE "Food" DROP COLUMN "foodProperiteId",
-- ADD COLUMN     "foodPropertyId" TEXT NOT NULL;

ALTER TABLE "Food" RENAME COLUMN "foodProperiteId" TO "foodPropertyId";


-- DropTable
-- DROP TABLE "FoodProperite";

-- -- CreateTable
-- CREATE TABLE "FoodProperty" (
--     "id" TEXT NOT NULL,
--     "gramm" DOUBLE PRECISION NOT NULL,
--     "kcal" DOUBLE PRECISION NOT NULL,
--     "portein" DOUBLE PRECISION NOT NULL,
--     "fat" DOUBLE PRECISION NOT NULL,
--     "ch" DOUBLE PRECISION NOT NULL,

--     CONSTRAINT "FoodProperty_pkey" PRIMARY KEY ("id")
-- );

ALTER TABLE "FoodProperite" RENAME TO "FoodProperty";


-- CreateIndex
CREATE UNIQUE INDEX "FoodProperty_id_key" ON "FoodProperty"("id");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_foodPropertyId_fkey" FOREIGN KEY ("foodPropertyId") REFERENCES "FoodProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
