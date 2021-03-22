/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[microAppId,version]` on the table `MicroAppData`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MicroAppData.microAppId_version_unique" ON "MicroAppData"("microAppId", "version");
