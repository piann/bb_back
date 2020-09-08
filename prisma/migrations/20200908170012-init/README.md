# Migration `20200908170012-init`

This migration has been generated at 9/8/2020, 5:00:12 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."FileObj" ADD COLUMN "uploadUserId" text  NOT NULL ;

ALTER TABLE "bb_schema"."FileObj" ADD FOREIGN KEY ("uploadUserId")REFERENCES "bb_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200906173901-init..20200908170012-init
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
@@ -212,8 +212,10 @@
 model FileObj{
   id String @id @default(cuid())
   isPublic Boolean
   permittedUserList User[] @relation(references: [id])
+  uploadUser User @relation(fields: [uploadUserId], references: [id], name:"uploadUserRelation")
+  uploadUserId String
   fileName String
   fileType String?
   category FileCategory?
   createdAt DateTime @default(now())
```


