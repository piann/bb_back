# Migration `20200829190522-init`

This migration has been generated at 8/29/2020, 7:05:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "FileCategory" ADD VALUE 'COMMENT'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200829190506-init..20200829190522-init
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
@@ -39,8 +39,9 @@
 }
 enum FileCategory{
   REPORT
+  COMMENT
   OTHERS
 }
 model User{
```


