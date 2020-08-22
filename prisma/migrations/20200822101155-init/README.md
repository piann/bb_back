# Migration `20200822101155-init`

This migration has been generated at 8/22/2020, 10:11:55 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "TargetType" ADD VALUE 'WINDOWS'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200816181856-init..20200822101155-init
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
@@ -25,8 +25,9 @@
 enum TargetType{
   WEB
   IOS
   ANDROID
+  WINDOWS
 }
 enum ResultCode{
   UNABLE_TO_JUDGE
```


