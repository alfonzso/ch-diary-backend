/*
  Warnings:

  - You are about to drop the column `kcal` on the `FoodProperty` table. All the data in the column will be lost.
  - You are about to drop the column `portein` on the `FoodProperty` table. All the data in the column will be lost.
  - Added the required column `energy` to the `FoodProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `FoodProperty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "FoodProperty" DROP COLUMN "kcal",
-- DROP COLUMN "portein",
-- ADD COLUMN     "energy" DOUBLE PRECISION NOT NULL,
-- ADD COLUMN     "protein" DOUBLE PRECISION NOT NULL;

ALTER TABLE "FoodProperty" RENAME COLUMN "kcal" TO "energy";
ALTER TABLE "FoodProperty" RENAME COLUMN "portein" TO "protein";