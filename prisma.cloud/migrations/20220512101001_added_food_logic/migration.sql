-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chDiaryId" TEXT;

-- CreateTable
CREATE TABLE "Interfood" (
    "id" TEXT NOT NULL,
    "foodType" TEXT NOT NULL DEFAULT E'-',
    "foodId" TEXT NOT NULL,

    CONSTRAINT "Interfood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodProperite" (
    "id" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "gramm" DOUBLE PRECISION NOT NULL,
    "kcal" DOUBLE PRECISION NOT NULL,
    "portein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "ch" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FoodProperite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "portion" DOUBLE PRECISION NOT NULL,
    "chDiaryId" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChDiary" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChDiary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interfood_id_key" ON "Interfood"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Interfood_foodType_key" ON "Interfood"("foodType");

-- CreateIndex
CREATE UNIQUE INDEX "FoodProperite_id_key" ON "FoodProperite"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Food_id_key" ON "Food"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChDiary_id_key" ON "ChDiary"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chDiaryId_fkey" FOREIGN KEY ("chDiaryId") REFERENCES "ChDiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interfood" ADD CONSTRAINT "Interfood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodProperite" ADD CONSTRAINT "FoodProperite_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_chDiaryId_fkey" FOREIGN KEY ("chDiaryId") REFERENCES "ChDiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
