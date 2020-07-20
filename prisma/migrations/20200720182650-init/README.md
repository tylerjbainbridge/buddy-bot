# Migration `20200720182650-init`

This migration has been generated at 7/20/2020, 6:26:50 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Guild" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"id" text  NOT NULL ,
"name" text  NOT NULL ,
"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Reminder" (
"channelId" text  NOT NULL ,
"content" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"guildId" text  NOT NULL ,
"id" text  NOT NULL ,
"isDone" boolean  NOT NULL DEFAULT false,
"messageId" text  NOT NULL ,
"remindAt" timestamp(3)  NOT NULL ,
"updatedAt" timestamp(3)  NOT NULL ,
"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Channel" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"guildId" text  NOT NULL ,
"id" text  NOT NULL ,
"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Command" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"guildId" text  NOT NULL ,
"id" text  NOT NULL ,
"response" text  NOT NULL ,
"trigger" text  NOT NULL ,
"updatedAt" timestamp(3)  NOT NULL ,
"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"guildId" text  NOT NULL ,
"id" text  NOT NULL ,
"timezone" text   ,
"updatedAt" timestamp(3)  NOT NULL ,
"username" text  NOT NULL ,
    PRIMARY KEY ("id"))

ALTER TABLE "public"."Reminder" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Reminder" ADD FOREIGN KEY ("guildId")REFERENCES "public"."Guild"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Channel" ADD FOREIGN KEY ("guildId")REFERENCES "public"."Guild"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Command" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Command" ADD FOREIGN KEY ("guildId")REFERENCES "public"."Guild"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."User" ADD FOREIGN KEY ("guildId")REFERENCES "public"."Guild"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200720182650-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,86 @@
+datasource db {
+    provider = "postgres"
+    url = "***"
+}
+
+generator prisma {
+    provider = "prisma-client-js"
+}
+
+model Guild {
+    id String @id
+
+    name String
+
+    user      User[]
+    commands  Command[]
+    reminders Reminder[]
+
+    createdAt DateTime  @default(now())
+    updatedAt DateTime  @updatedAt
+    Channel   Channel[]
+}
+
+model Reminder {
+    id String @id
+
+    content String
+
+    user   User   @relation(fields: [userId], references: [id])
+    userId String
+
+    guild   Guild  @relation(fields: [guildId], references: [id])
+    guildId String
+
+    messageId String
+    channelId String
+
+    isDone   Boolean  @default(false)
+    remindAt DateTime
+
+    createdAt DateTime @default(now())
+    updatedAt DateTime @updatedAt
+}
+
+model Channel {
+    id String @id
+
+    guild   Guild  @relation(fields: [guildId], references: [id])
+    guildId String
+
+    createdAt DateTime @default(now())
+    updatedAt DateTime @updatedAt
+}
+
+model Command {
+    id String @id
+
+    trigger  String
+    response String
+
+    user   User   @relation(fields: [userId], references: [id])
+    userId String
+
+    guild   Guild  @relation(fields: [guildId], references: [id])
+    guildId String
+
+    createdAt DateTime @default(now())
+    updatedAt DateTime @updatedAt
+}
+
+model User {
+    id String @id
+
+    username String
+
+    guild   Guild  @relation(fields: [guildId], references: [id])
+    guildId String
+
+    commands Command[]
+
+    timezone String?
+
+    createdAt DateTime   @default(now())
+    updatedAt DateTime   @updatedAt
+    Reminder  Reminder[]
+}
```


