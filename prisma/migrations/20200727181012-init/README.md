# Migration `20200727181012-init`

This migration has been generated by piann <shadow_hat@naver.com> at 7/27/2020, 6:10:12 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `bb_db`.`User` (
`id` int NOT NULL  AUTO_INCREMENT,
`name` varchar(191) NOT NULL ,
`email` varchar(191) NOT NULL ,
`passwordHash` varchar(191) NOT NULL ,
`phoneNumber` varchar(191) NOT NULL ,
`isLocked` boolean NOT NULL DEFAULT true,
`reasonOfLock` varchar(191) NOT NULL ,
`numberOfLoginTrial` int NOT NULL DEFAULT 0,
`note` varchar(191) NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE UNIQUE INDEX `User.email` ON `bb_db`.`User`(`email`)
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200727181012-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,23 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "mysql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User{
+    id  Int @id @default(autoincrement())
+    name String
+    email String @unique
+    passwordHash String
+    phoneNumber String
+    isLocked Boolean @default(true)
+    reasonOfLock String
+    numberOfLoginTrial Int @default(value:0)    
+    note String
+}
```

