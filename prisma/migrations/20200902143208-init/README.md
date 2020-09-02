# Migration `20200902143208-init`

This migration has been generated at 9/2/2020, 2:32:08 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."Report" ADD COLUMN "vulLevel" integer   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200830000207-init..20200902143208-init
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
@@ -246,8 +246,9 @@
   fileId String?
   progressStatus ProgressStatus[]
   result ReportResult[]
   bountyAmount Int @default(value:0)
+  vulLevel Int?
   evaluationText String?
   commentList ReportComment[]
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
```


