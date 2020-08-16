# Migration `20200804142612-init`

This migration has been generated by piann <shadow_hat@naver.com> at 8/4/2020, 2:26:12 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."ReportComment" ADD COLUMN "writerId" text  NOT NULL ;

ALTER TABLE "bb_schema"."ReportComment" ADD FOREIGN KEY ("writerId")REFERENCES "bb_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200804140035-init..20200804142612-init
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
@@ -292,8 +292,10 @@
 model ReportComment{
   id String @id @default(cuid())
   content String
+  writer User @relation(fields: [writerId], references:[id])
+  writerId String
   report Report @relation(fields: [reportId], references: [id])
   reportId String
   file FileObj? @relation(fields: [fileId], references: [id])
   fileId String?
```

