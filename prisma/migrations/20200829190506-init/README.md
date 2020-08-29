# Migration `20200829190506-init`

This migration has been generated at 8/29/2020, 7:05:06 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "TargetType" ADD VALUE 'LINUX'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200822101155-init..20200829190506-init
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
@@ -26,8 +26,9 @@
   WEB
   IOS
   ANDROID
   WINDOWS
+  LINUX
 }
 enum ResultCode{
   UNABLE_TO_JUDGE
```


