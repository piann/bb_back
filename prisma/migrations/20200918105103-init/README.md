# Migration `20200918105103-init`

This migration has been generated at 9/18/2020, 10:51:03 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."FileObj" ALTER COLUMN "category" DROP DEFAULT;

ALTER TABLE "bb_schema"."Report" ADD COLUMN "grantedCredit" integer  NOT NULL DEFAULT 0;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200912223751-init..20200918105103-init
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
@@ -249,9 +249,10 @@
   fileId String?
   progressStatus ProgressStatus[]
   result ReportResult[]
   bountyAmount Int @default(value:0)
-  vulLevel Int?
+  grantedCredit Int @default(value:0)
+  vulLevel Int? //1,2,3,4
   cvssScore Float?
   writingScore Float?
   evaluationText String?
   commentList ReportComment[]
```


