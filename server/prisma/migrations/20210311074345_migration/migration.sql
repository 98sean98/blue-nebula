/*
  Warnings:

  - You are about to drop the `App` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_updaterId_fkey";

-- DropTable
DROP TABLE "App";

-- CreateTable
CREATE TABLE "MicroApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "data" JSON,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT,
    "updaterId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MicroApp.name_unique" ON "MicroApp"("name");

-- AddForeignKey
ALTER TABLE "MicroApp" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroApp" ADD FOREIGN KEY ("updaterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
