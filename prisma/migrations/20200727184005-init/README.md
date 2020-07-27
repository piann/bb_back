# Migration `20200727184005-init`

This migration has been generated by piann <shadow_hat@naver.com> at 7/27/2020, 6:40:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `bb_db`.`User` MODIFY `phoneNumber` varchar(191),
MODIFY `reasonOfLock` varchar(191),
MODIFY `numberOfLoginTrial` int DEFAULT 0,
MODIFY `note` varchar(191);
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200727182800-init..20200727184005-init
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -14,10 +14,10 @@
     id  Int @id
     name String
     email String @unique
     passwordHash String
-    phoneNumber String
+    phoneNumber String?
     isLocked Boolean @default(true)
-    reasonOfLock String
-    numberOfLoginTrial Int @default(value:0)    
-    note String
+    reasonOfLock String?
+    numberOfLoginTrial Int? @default(value:0)    
+    note String?
 }
```

