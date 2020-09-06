# Migration `20200906173901-init`

This migration has been generated at 9/6/2020, 5:39:01 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."User" ADD COLUMN "passwordResetSecret" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200904215651-init..20200906173901-init
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
@@ -58,8 +58,9 @@
     picId String?
     note String?
     role Role
     authSecret String?
+    passwordResetSecret String?
     hackerInfo HackerInfo?
     businessInfo BusinessInfo?
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt @default(now())
```


