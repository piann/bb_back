# Migration `20200809150557-init`

This migration has been generated at 8/9/2020, 3:05:57 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN "realName" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200804205009-init..20200809150557-init
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
@@ -42,10 +42,9 @@
 }
 model User{
     id String @id @default(cuid())
-    firstName String
-    lastName String
+    realName String?
     nickName String @unique
     email String @unique
     passwordHash String
     phoneNumber String?
```


