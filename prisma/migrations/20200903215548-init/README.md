# Migration `20200903215548-init`

This migration has been generated at 9/3/2020, 9:55:48 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."Report" ADD COLUMN "cvssScore" integer   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902143208-init..20200903215548-init
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
@@ -247,8 +247,9 @@
   progressStatus ProgressStatus[]
   result ReportResult[]
   bountyAmount Int @default(value:0)
   vulLevel Int?
+  cvssScore Int?
   evaluationText String?
   commentList ReportComment[]
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
```


