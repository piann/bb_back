# Migration `20200912223751-init`

This migration has been generated at 9/12/2020, 10:37:51 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "FileCategory_new" AS ENUM ('REPORT', 'IMAGE', 'OTHERS');
ALTER TABLE "bb_schema"."FileObj" ALTER COLUMN "category" DROP DEFAULT,
                        ALTER COLUMN "category" TYPE "FileCategory_new" USING ("category"::text::"FileCategory_new"),
                        ALTER COLUMN "category" SET DEFAULT 'REPORT';
ALTER TYPE "FileCategory" RENAME TO "FileCategory_old";
ALTER TYPE "FileCategory_new" RENAME TO "FileCategory";
DROP TYPE "FileCategory_old"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200908170012-init..20200912223751-init
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
@@ -39,9 +39,9 @@
 }
 enum FileCategory{
   REPORT
-  COMMENT
+  IMAGE
   OTHERS
 }
 model User{
```


