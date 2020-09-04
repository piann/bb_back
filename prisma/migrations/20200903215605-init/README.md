# Migration `20200903215605-init`

This migration has been generated at 9/3/2020, 9:56:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."Report" DROP COLUMN "cvssScore",
ADD COLUMN "cvssScore" Decimal(65,30)   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200903215548-init..20200903215605-init
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
@@ -247,9 +247,9 @@
   progressStatus ProgressStatus[]
   result ReportResult[]
   bountyAmount Int @default(value:0)
   vulLevel Int?
-  cvssScore Int?
+  cvssScore Float?
   evaluationText String?
   commentList ReportComment[]
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
```


