-- CreateTable
CREATE TABLE "AppData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSON,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT,
    "updaterId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppData.name_unique" ON "AppData"("name");

-- AddForeignKey
ALTER TABLE "AppData" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppData" ADD FOREIGN KEY ("updaterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
