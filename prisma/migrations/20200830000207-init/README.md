# Migration `20200830000207-init`

This migration has been generated at 8/30/2020, 12:02:07 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."BugBountyProgram" ADD COLUMN "managedBy" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200829190522-init..20200830000207-init
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
@@ -125,8 +125,9 @@
   exclusionList BountyExclusion[]
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
   reportList Report[]
+  managedBy String? // self, zerowhale
 }
 model PrivateProgramConnUser{
   id String @id @default(cuid())
```


