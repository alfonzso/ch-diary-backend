/*
  Warnings:

  - You are about to drop the column `foodType` on the `Interfood` table. All the data in the column will be lost.
  - Added the required column `foodId` to the `Interfood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodTypeId` to the `Interfood` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Interfood_foodType_key";

-- AlterTable
ALTER TABLE "Interfood" DROP COLUMN "foodType",
ADD COLUMN     "foodId" TEXT NOT NULL,
ADD COLUMN     "foodTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "InterfoodType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'-',

    CONSTRAINT "InterfoodType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterfoodType_id_key" ON "InterfoodType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InterfoodType_name_key" ON "InterfoodType"("name");

-- AddForeignKey
ALTER TABLE "Interfood" ADD CONSTRAINT "Interfood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
