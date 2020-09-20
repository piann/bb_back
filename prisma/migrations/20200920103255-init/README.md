# Migration `20200920103255-init`

This migration has been generated at 9/20/2020, 7:32:55 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."BugBountyProgram" DROP COLUMN "mediumriceMax",
ADD COLUMN "mediumPriceMax" integer   NOT NULL DEFAULT 0
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920002631-init..20200920103255-init
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
@@ -114,9 +114,9 @@
   closeDate DateTime?
   lowPriceMin Int @default(value:0)
   lowPriceMax Int @default(value:0)
   mediumPriceMin Int @default(value:0)
-  mediumriceMax Int @default(value:0)
+  mediumPriceMax Int @default(value:0)
   highPriceMin Int @default(value:0)
   highriceMax Int @default(value:0)
   fatalPriceMin Int @default(value:0)
   fatalPriceMax Int @default(value:0)
```


