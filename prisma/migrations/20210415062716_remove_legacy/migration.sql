-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HACKER', 'BUSINESS', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReasonOfLock" AS ENUM ('NEW_ACCOUNT', 'TOO_MANY_TRIAL');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('WEB', 'IOS', 'ANDROID', 'WINDOWS', 'LINUX');

-- CreateEnum
CREATE TYPE "ResultCode" AS ENUM ('UNABLE_TO_JUDGE', 'DUPLICATED', 'NOT_VULNERABILITY', 'NOT_TARGET_BOUNTY', 'TARGET_BOUNTY');

-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('REPORT', 'IMAGE', 'OTHERS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "realName" TEXT,
    "nickName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerificationSecret" TEXT,
    "numberOfPhoneVerificationFail" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "reasonOfLock" "ReasonOfLock",
    "numberOfLoginFail" INTEGER NOT NULL DEFAULT 0,
    "picId" TEXT,
    "note" TEXT,
    "role" "Role" NOT NULL,
    "authSecret" TEXT,
    "passwordResetSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HackerInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credit" INTEGER NOT NULL DEFAULT 0,
    "totalBounty" INTEGER NOT NULL DEFAULT 0,
    "trustLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "nameId" TEXT NOT NULL,
    "description" TEXT,
    "webPageUrl" TEXT,
    "logoId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BugBountyProgram" (
    "id" TEXT NOT NULL,
    "ownerCompanyId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "disclosurePolicy" TEXT NOT NULL DEFAULT E'disclosure policy',
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "openDate" TIMESTAMP(3),
    "closeDate" TIMESTAMP(3),
    "lowPriceMin" INTEGER NOT NULL DEFAULT 0,
    "lowPriceMax" INTEGER NOT NULL DEFAULT 0,
    "mediumPriceMin" INTEGER NOT NULL DEFAULT 0,
    "mediumPriceMax" INTEGER NOT NULL DEFAULT 0,
    "highPriceMin" INTEGER NOT NULL DEFAULT 0,
    "highriceMax" INTEGER NOT NULL DEFAULT 0,
    "fatalPriceMin" INTEGER NOT NULL DEFAULT 0,
    "fatalPriceMax" INTEGER NOT NULL DEFAULT 0,
    "introduction" TEXT NOT NULL DEFAULT E'introduction',
    "requiredTrustLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managedBy" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateProgramConnUser" (
    "id" TEXT NOT NULL,
    "uId" TEXT NOT NULL,
    "bId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramRule" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramRuleConnBugBountyProgram" (
    "id" TEXT NOT NULL,
    "pId" INTEGER NOT NULL,
    "bId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InScopeTarget" (
    "id" SERIAL NOT NULL,
    "type" "TargetType" NOT NULL,
    "value" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutOfScopeTarget" (
    "id" SERIAL NOT NULL,
    "type" "TargetType" NOT NULL,
    "value" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BountyExclusion" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BountyExclusionConnBugBountyProgram" (
    "id" TEXT NOT NULL,
    "eId" INTEGER NOT NULL,
    "bId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTip" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTipConnBugBountyProgram" (
    "id" TEXT NOT NULL,
    "rId" INTEGER NOT NULL,
    "bId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileObj" (
    "id" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "uploadUserId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT,
    "category" "FileCategory",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "bbpId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "vulId" INTEGER NOT NULL,
    "attackComplexity" INTEGER,
    "requiredPriv" INTEGER,
    "userInteraction" INTEGER,
    "confidentiality" INTEGER,
    "integrity" INTEGER,
    "availablity" INTEGER,
    "title" TEXT,
    "location" TEXT,
    "enviroment" TEXT,
    "description" TEXT NOT NULL,
    "dump" TEXT,
    "additionalText" TEXT,
    "fileId" TEXT,
    "bountyAmount" INTEGER NOT NULL DEFAULT 0,
    "grantedCredit" INTEGER NOT NULL DEFAULT 0,
    "vulLevel" INTEGER,
    "cvssScore" DOUBLE PRECISION,
    "writingScore" DOUBLE PRECISION,
    "evaluationText" TEXT,
    "note" TEXT,
    "isDisclosed" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaboratorInfo" (
    "id" SERIAL NOT NULL,
    "rId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contributionRatio" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vulnerability" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressStatus" (
    "id" TEXT NOT NULL,
    "progressIdx" INTEGER NOT NULL DEFAULT 0,
    "reportId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportResult" (
    "id" TEXT NOT NULL,
    "resultCode" "ResultCode" NOT NULL,
    "reportId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "writerId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "fileId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FileObjToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InScopeTargetToReport" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.nickName_unique" ON "User"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HackerInfo.userId_unique" ON "HackerInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo.userId_unique" ON "BusinessInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company.companyName_unique" ON "Company"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Company.nameId_unique" ON "Company"("nameId");

-- CreateIndex
CREATE UNIQUE INDEX "_FileObjToUser_AB_unique" ON "_FileObjToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FileObjToUser_B_index" ON "_FileObjToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InScopeTargetToReport_AB_unique" ON "_InScopeTargetToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_InScopeTargetToReport_B_index" ON "_InScopeTargetToReport"("B");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("picId") REFERENCES "FileObj"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackerInfo" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInfo" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInfo" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD FOREIGN KEY ("logoId") REFERENCES "FileObj"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugBountyProgram" ADD FOREIGN KEY ("ownerCompanyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateProgramConnUser" ADD FOREIGN KEY ("uId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateProgramConnUser" ADD FOREIGN KEY ("bId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramRuleConnBugBountyProgram" ADD FOREIGN KEY ("pId") REFERENCES "ProgramRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramRuleConnBugBountyProgram" ADD FOREIGN KEY ("bId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InScopeTarget" ADD FOREIGN KEY ("programId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutOfScopeTarget" ADD FOREIGN KEY ("programId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BountyExclusionConnBugBountyProgram" ADD FOREIGN KEY ("eId") REFERENCES "BountyExclusion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BountyExclusionConnBugBountyProgram" ADD FOREIGN KEY ("bId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTipConnBugBountyProgram" ADD FOREIGN KEY ("rId") REFERENCES "ReportTip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTipConnBugBountyProgram" ADD FOREIGN KEY ("bId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileObj" ADD FOREIGN KEY ("uploadUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("bbpId") REFERENCES "BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("vulId") REFERENCES "Vulnerability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("fileId") REFERENCES "FileObj"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorInfo" ADD FOREIGN KEY ("rId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorInfo" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressStatus" ADD FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportResult" ADD FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD FOREIGN KEY ("fileId") REFERENCES "FileObj"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileObjToUser" ADD FOREIGN KEY ("A") REFERENCES "FileObj"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileObjToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InScopeTargetToReport" ADD FOREIGN KEY ("A") REFERENCES "InScopeTarget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InScopeTargetToReport" ADD FOREIGN KEY ("B") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
