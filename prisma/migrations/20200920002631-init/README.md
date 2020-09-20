# Migration `20200920002631-init`

This migration has been generated at 9/20/2020, 9:26:31 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."BountyExclusion" DROP CONSTRAINT "BountyExclusion_bugBountyProgramId_fkey"

ALTER TABLE "bb_schema"."BountyExclusion" DROP COLUMN "bugBountyProgramId"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920001344-init..20200920002631-init
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
@@ -122,9 +122,8 @@
   fatalPriceMax Int @default(value:0)
   introduction String @default(value:"introduction")
   inScopeList InScopeTarget[]
   outOfScopeList OutOfScopeTarget[]
-  exclusionList BountyExclusion[]
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt @default(now())
   reportList Report[]
   managedBy String? // self, zerowhale
```


