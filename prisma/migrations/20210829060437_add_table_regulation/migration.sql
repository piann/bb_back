-- CreateTable
CREATE TABLE "Regulation" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulationConnBugBountyProgram" (
    "id" TEXT NOT NULL,
    "rId" INTEGER NOT NULL,
    "bId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegulationConnBugBountyProgram" ADD FOREIGN KEY ("rId") REFERENCES "Regulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulationConnBugBountyProgram" ADD FOREIGN KEY ("bId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
