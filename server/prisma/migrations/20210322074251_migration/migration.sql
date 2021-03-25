/*
  Warnings:

  - You are about to drop the column `version` on the `MicroApp` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `MicroApp` table. All the data in the column will be lost.
  - Made the column `creatorId` on table `MicroApp` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updaterId` on table `MicroApp` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MicroApp" DROP COLUMN "version",
DROP COLUMN "data",
ADD COLUMN     "activeVersion" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "creatorId" SET NOT NULL,
ALTER COLUMN "updaterId" SET NOT NULL;

-- CreateTable
CREATE TABLE "MicroAppData" (
    "id" TEXT NOT NULL,
    "microAppId" TEXT NOT NULL,
    "name" TEXT,
    "version" INTEGER NOT NULL,
    "data" JSON NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MicroAppData" ADD FOREIGN KEY ("microAppId") REFERENCES "MicroApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroAppData" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
