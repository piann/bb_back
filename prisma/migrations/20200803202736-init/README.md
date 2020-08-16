# Migration `20200803202736-init`

This migration has been generated by piann <shadow_hat@naver.com> at 8/3/2020, 8:27:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "bb_schema"."User" ADD COLUMN "picId" text   ;

ALTER TABLE "bb_schema"."User" ADD FOREIGN KEY ("picId")REFERENCES "bb_schema"."FileObj"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200802191545-init..20200803202736-init
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
@@ -50,9 +50,11 @@
     passwordHash String
     phoneNumber String?
     isLocked Boolean @default(true)
     reasonOfLock ReasonOfLock?
-    numberOfLoginFail Int @default(value:0)    
+    numberOfLoginFail Int @default(value:0)
+    profilePicture FileObj? @relation(name:"profilePictureRelation", fields: [picId], references: [id])
+    picId String?
     note String?
     role Role
     hackerInfo HackerInfo?
     businessInfo BusinessInfo?
```

