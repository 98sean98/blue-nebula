-- CreateTable
CREATE TABLE "SimpleUser" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroAppDataUsageLog" (
    "id" TEXT NOT NULL,
    "simpleUserId" TEXT NOT NULL,
    "microAppDataId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationLatitude" DOUBLE PRECISION,
    "locationLongitude" DOUBLE PRECISION,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SimpleUser.identifier_unique" ON "SimpleUser"("identifier");

-- AddForeignKey
ALTER TABLE "MicroAppDataUsageLog" ADD FOREIGN KEY ("simpleUserId") REFERENCES "SimpleUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroAppDataUsageLog" ADD FOREIGN KEY ("microAppDataId") REFERENCES "MicroAppData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
