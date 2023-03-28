-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hashedToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterfoodType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '-'
);

-- CreateTable
CREATE TABLE "Interfood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interfoodTypeId" TEXT NOT NULL,
    CONSTRAINT "Interfood_interfoodTypeId_fkey" FOREIGN KEY ("interfoodTypeId") REFERENCES "InterfoodType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FoodProperty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gramm" REAL NOT NULL,
    "energy" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "ch" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "portion" REAL NOT NULL,
    "foodPropertyId" TEXT NOT NULL,
    "interfoodId" TEXT NOT NULL,
    CONSTRAINT "Food_interfoodId_fkey" FOREIGN KEY ("interfoodId") REFERENCES "Interfood" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Food_foodPropertyId_fkey" FOREIGN KEY ("foodPropertyId") REFERENCES "FoodProperty" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChDiary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    CONSTRAINT "ChDiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChDiary_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_id_key" ON "RefreshToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InterfoodType_id_key" ON "InterfoodType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InterfoodType_name_key" ON "InterfoodType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Interfood_id_key" ON "Interfood"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FoodProperty_id_key" ON "FoodProperty"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Food_id_key" ON "Food"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChDiary_id_key" ON "ChDiary"("id");
