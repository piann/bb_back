# Migration `20200920001344-init`

This migration has been generated at 9/20/2020, 9:13:44 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."BountyExclusion" DROP CONSTRAINT "BountyExclusion_programId_fkey"

ALTER TABLE "bb_schema"."BountyExclusion" DROP COLUMN "programId",
ADD COLUMN "bugBountyProgramId" text   

CREATE TABLE "bb_schema"."BountyExclusionConnBugBountyProgram" (
"id" text   NOT NULL ,
"eId" integer   NOT NULL ,
"bId" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

ALTER TABLE "bb_schema"."BountyExclusionConnBugBountyProgram" ADD FOREIGN KEY ("eId")REFERENCES "bb_schema"."BountyExclusion"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "bb_schema"."BountyExclusionConnBugBountyProgram" ADD FOREIGN KEY ("bId")REFERENCES "bb_schema"."BugBountyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "bb_schema"."BountyExclusion" ADD FOREIGN KEY ("bugBountyProgramId")REFERENCES "bb_schema"."BugBountyProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER INDEX "bb_schema"."BusinessInfo.userId" RENAME TO "BusinessInfo.userId_unique"

ALTER INDEX "bb_schema"."Company.companyName" RENAME TO "Company.companyName_unique"

ALTER INDEX "bb_schema"."Company.nameId" RENAME TO "Company.nameId_unique"

ALTER INDEX "bb_schema"."HackerInfo.userId" RENAME TO "HackerInfo.userId_unique"

ALTER INDEX "bb_schema"."User.email" RENAME TO "User.email_unique"

ALTER INDEX "bb_schema"."User.nickName" RENAME TO "User.nickName_unique"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200918105836-init..20200920001344-init
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -183,15 +183,23 @@
 model BountyExclusion{
   id Int @id @default(autoincrement())
   value String
-  bugBountyProgram BugBountyProgram @relation(fields: [programId], references: [id])
-  programId String
   note String?
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
 }
+model BountyExclusionConnBugBountyProgram{
+  id String @id @default(cuid())
+  bountyExclusion BountyExclusion @relation(fields: [eId], references:[id])
+  eId Int
+  bugBountyProgram BugBountyProgram @relation(fields: [bId], references:[id])
+  bId String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt @default(now())
+}
+
 model ReportTip{
   id Int @id @default(autoincrement())
   value String
   note String?
```


