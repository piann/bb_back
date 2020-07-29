# Migration `20200728201044-init`

This migration has been generated by piann <shadow_hat@naver.com> at 7/28/2020, 8:10:44 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "bb_schema"."BusinessInfo.companyName"

ALTER TABLE "bb_schema"."BugBountyProgram" DROP CONSTRAINT "BugBountyProgram_ownerId_fkey"

CREATE TABLE "bb_schema"."Company" (
"id" text  NOT NULL ,
"companyName" text  NOT NULL ,
"webPage" text   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

ALTER TABLE "bb_schema"."BugBountyProgram" DROP COLUMN "ownerId",
ADD COLUMN "ownerCompanyId" text  NOT NULL ,
ADD COLUMN "isPrivate" boolean  NOT NULL ,
ADD COLUMN "disclosurePolicy" text  NOT NULL ,
ADD COLUMN "closeDate" timestamp(3)   ;

ALTER TABLE "bb_schema"."BusinessInfo" DROP COLUMN "companyName",
ADD COLUMN "companyId" text  NOT NULL ;

CREATE UNIQUE INDEX "Company.companyName" ON "bb_schema"."Company"("companyName")

ALTER TABLE "bb_schema"."BugBountyProgram" ADD FOREIGN KEY ("ownerCompanyId")REFERENCES "bb_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "bb_schema"."BusinessInfo" ADD FOREIGN KEY ("companyId")REFERENCES "bb_schema"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200728180522-init..20200728201044-init
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
@@ -71,18 +71,29 @@
 model BusinessInfo{
   id String @id @default(cuid())
   user User @relation(fields: [userId], references: [id])
   userId String
+  company Company @relation(fields: [companyId], references: [id])
+  companyId String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt @default(now())
+}
+
+model Company{
+  id String @id @default(cuid())
   companyName String @unique
+  webPage String?
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
 }
-
 model BugBountyProgram{
   id String @id @default(cuid())
-  owner User @relation(fields: [ownerId], references: [id])
-  ownerId String
+  ownerCompany User @relation(fields: [ownerCompanyId], references: [id])
+  ownerCompanyId String
+  isPrivate Boolean
+  disclosurePolicy String
+  closeDate DateTime?
   lowPriceMin Int
   lowPriceMax Int
   mediumPriceMin Int
   mediumriceMax Int
```

