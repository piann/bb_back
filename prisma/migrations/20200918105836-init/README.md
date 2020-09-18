# Migration `20200918105836-init`

This migration has been generated at 9/18/2020, 10:58:36 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."Report" ADD COLUMN "note" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200918105103-init..20200918105836-init
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
@@ -255,8 +255,9 @@
   cvssScore Float?
   writingScore Float?
   evaluationText String?
   commentList ReportComment[]
+  note String?
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
   //
 }
```


