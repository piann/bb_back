# Migration `20200816181856-init`

This migration has been generated at 8/16/2020, 6:18:56 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."User" ADD COLUMN "authSecret" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200809150557-init..20200816181856-init
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
@@ -54,8 +54,9 @@
     profilePicture FileObj? @relation(name:"profilePictureRelation", fields: [picId], references: [id])
     picId String?
     note String?
     role Role
+    authSecret String?
     hackerInfo HackerInfo?
     businessInfo BusinessInfo?
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt @default(now())
```


