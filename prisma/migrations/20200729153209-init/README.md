# Migration `20200729153209-init`

This migration has been generated by piann <shadow_hat@naver.com> at 7/29/2020, 3:32:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."FileObj" DROP COLUMN "mimetype",
ADD COLUMN "mimeType" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200728215435-init..20200729153209-init
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
@@ -169,9 +169,9 @@
   id String @id @default(cuid())
   isPublic Boolean
   permittedUserList User[] @relation(references: [id])
   fileName String
-  mimetype String?
+  mimeType String?
   rawData String
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
 }
```

