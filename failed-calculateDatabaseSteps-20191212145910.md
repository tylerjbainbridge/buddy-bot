# Failed calculateDatabaseSteps at 2019-12-12T19:59:10.464Z
## RPC One-Liner
```json
{"id":3,"jsonrpc":"2.0","method":"calculateDatabaseSteps","params":{"projectInfo":"","assumeToBeApplied":[{"stepType":"CreateModel","model":"Guild"},{"stepType":"CreateField","model":"Guild","field":"id","type":"String","arity":"required"},{"stepType":"CreateDirective","model":"Guild","field":"id","directive":"id"},{"stepType":"CreateField","model":"Guild","field":"name","type":"String","arity":"required"},{"stepType":"CreateField","model":"Guild","field":"user","type":"User","arity":"list"},{"stepType":"CreateField","model":"Guild","field":"commands","type":"Command","arity":"list"},{"stepType":"CreateField","model":"Guild","field":"createdAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Guild","field":"createdAt","directive":"default"},{"stepType":"CreateDirectiveArgument","model":"Guild","field":"createdAt","directive":"default","argument":"","value":"now()"},{"stepType":"CreateField","model":"Guild","field":"updatedAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Guild","field":"updatedAt","directive":"updatedAt"},{"stepType":"CreateModel","model":"Channel"},{"stepType":"CreateField","model":"Channel","field":"id","type":"String","arity":"required"},{"stepType":"CreateDirective","model":"Channel","field":"id","directive":"id"},{"stepType":"CreateField","model":"Channel","field":"guild","type":"Guild","arity":"required"},{"stepType":"CreateField","model":"Channel","field":"createdAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Channel","field":"createdAt","directive":"default"},{"stepType":"CreateDirectiveArgument","model":"Channel","field":"createdAt","directive":"default","argument":"","value":"now()"},{"stepType":"CreateField","model":"Channel","field":"updatedAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Channel","field":"updatedAt","directive":"updatedAt"},{"stepType":"CreateModel","model":"Command"},{"stepType":"CreateField","model":"Command","field":"id","type":"String","arity":"required"},{"stepType":"CreateDirective","model":"Command","field":"id","directive":"id"},{"stepType":"CreateField","model":"Command","field":"trigger","type":"String","arity":"required"},{"stepType":"CreateField","model":"Command","field":"response","type":"String","arity":"required"},{"stepType":"CreateField","model":"Command","field":"user","type":"User","arity":"required"},{"stepType":"CreateField","model":"Command","field":"guild","type":"Guild","arity":"required"},{"stepType":"CreateField","model":"Command","field":"createdAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Command","field":"createdAt","directive":"default"},{"stepType":"CreateDirectiveArgument","model":"Command","field":"createdAt","directive":"default","argument":"","value":"now()"},{"stepType":"CreateField","model":"Command","field":"updatedAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Command","field":"updatedAt","directive":"updatedAt"},{"stepType":"CreateModel","model":"User"},{"stepType":"CreateField","model":"User","field":"id","type":"String","arity":"required"},{"stepType":"CreateDirective","model":"User","field":"id","directive":"id"},{"stepType":"CreateField","model":"User","field":"guild","type":"Guild","arity":"required"},{"stepType":"CreateField","model":"User","field":"commands","type":"Command","arity":"list"},{"stepType":"CreateField","model":"User","field":"createdAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"User","field":"createdAt","directive":"default"},{"stepType":"CreateDirectiveArgument","model":"User","field":"createdAt","directive":"default","argument":"","value":"now()"},{"stepType":"CreateField","model":"User","field":"updatedAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"User","field":"updatedAt","directive":"updatedAt"},{"stepType":"CreateModel","model":"Reminder"},{"stepType":"CreateField","model":"Reminder","field":"id","type":"String","arity":"required"},{"stepType":"CreateDirective","model":"Reminder","field":"id","directive":"id"},{"stepType":"CreateField","model":"Reminder","field":"messageId","type":"String","arity":"required"},{"stepType":"CreateField","model":"Reminder","field":"user","type":"User","arity":"list"},{"stepType":"CreateField","model":"Reminder","field":"isDone","type":"Boolean","arity":"required"},{"stepType":"CreateField","model":"Reminder","field":"remindAt","type":"DateTime","arity":"required"},{"stepType":"CreateField","model":"Reminder","field":"createdAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Reminder","field":"createdAt","directive":"default"},{"stepType":"CreateDirectiveArgument","model":"Reminder","field":"createdAt","directive":"default","argument":"","value":"now()"},{"stepType":"CreateField","model":"Reminder","field":"updatedAt","type":"DateTime","arity":"required"},{"stepType":"CreateDirective","model":"Reminder","field":"updatedAt","directive":"updatedAt"},{"stepType":"CreateField","model":"Guild","field":"reminders","type":"Reminder","arity":"list"},{"stepType":"CreateField","model":"User","field":"username","type":"String","arity":"required"},{"stepType":"CreateField","model":"User","field":"timezone","type":"String","arity":"required"},{"stepType":"CreateField","model":"Reminder","field":"guild","type":"Guild","arity":"required"}],"stepsToApply":[{"stepType":"CreateField","model":"Reminder","field":"content","type":"String","arity":"required"},{"stepType":"CreateField","model":"Reminder","field":"guild","type":"Guild","arity":"required"},{"stepType":"DeleteField","model":"Reminder","field":"messageId"}],"sourceConfig":"datasource db {\n    provider = \"postgres\"\n    url      = \"postgres://ulhascvnhtawsd:de1c0e091478eee0a76e41f223d1435a4e3d5ae3a5f1dc36a15724eeb02d1c38@ec2-174-129-255-37.compute-1.amazonaws.com:5432/d5agn6r6p90rek?sslmode=require\"\n}\n\ngenerator photon {\n    provider = \"photonjs\"\n}\n\nmodel Guild {\n    id String @id\n\n    name String\n\n    user User[]\n    commands Command[]\n    reminders Reminder[]\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel Reminder {\n    id String @id\n\n    content String\n\n    user User[]\n    guild Guild\n\n    isDone Boolean\n    remindAt DateTime\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel Channel {\n    id String @id\n\n    guild Guild\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel Command {\n    id String @id\n\n    trigger String\n    response String\n\n    user User\n    guild Guild\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel User {\n    id String @id\n\n    username String\n\n    guild Guild\n    commands Command[]\n\n    timezone String\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}"}}
```

## RPC Input Readable
```json
{
  "id": 3,
  "jsonrpc": "2.0",
  "method": "calculateDatabaseSteps",
  "params": {
    "projectInfo": "",
    "assumeToBeApplied": [
      {
        "stepType": "CreateModel",
        "model": "Guild"
      },
      {
        "stepType": "CreateField",
        "model": "Guild",
        "field": "id",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Guild",
        "field": "id",
        "directive": "id"
      },
      {
        "stepType": "CreateField",
        "model": "Guild",
        "field": "name",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Guild",
        "field": "user",
        "type": "User",
        "arity": "list"
      },
      {
        "stepType": "CreateField",
        "model": "Guild",
        "field": "commands",
        "type": "Command",
        "arity": "list"
      },
      {
        "stepType": "CreateField",
        "model": "Guild",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Guild",
        "field": "createdAt",
        "directive": "default"
      },
      {
        "stepType": "CreateDirectiveArgument",
        "model": "Guild",
        "field": "createdAt",
        "directive": "default",
        "argument": "",
        "value": "now()"
      },
      {
        "stepType": "CreateField",
        "model": "Guild",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Guild",
        "field": "updatedAt",
        "directive": "updatedAt"
      },
      {
        "stepType": "CreateModel",
        "model": "Channel"
      },
      {
        "stepType": "CreateField",
        "model": "Channel",
        "field": "id",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Channel",
        "field": "id",
        "directive": "id"
      },
      {
        "stepType": "CreateField",
        "model": "Channel",
        "field": "guild",
        "type": "Guild",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Channel",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Channel",
        "field": "createdAt",
        "directive": "default"
      },
      {
        "stepType": "CreateDirectiveArgument",
        "model": "Channel",
        "field": "createdAt",
        "directive": "default",
        "argument": "",
        "value": "now()"
      },
      {
        "stepType": "CreateField",
        "model": "Channel",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Channel",
        "field": "updatedAt",
        "directive": "updatedAt"
      },
      {
        "stepType": "CreateModel",
        "model": "Command"
      },
      {
        "stepType": "CreateField",
        "model": "Command",
        "field": "id",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Command",
        "field": "id",
        "directive": "id"
      },
      {
        "stepType": "CreateField",
        "model": "Command",
        "field": "trigger",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Command",
        "field": "response",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Command",
        "field": "user",
        "type": "User",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Command",
        "field": "guild",
        "type": "Guild",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Command",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Command",
        "field": "createdAt",
        "directive": "default"
      },
      {
        "stepType": "CreateDirectiveArgument",
        "model": "Command",
        "field": "createdAt",
        "directive": "default",
        "argument": "",
        "value": "now()"
      },
      {
        "stepType": "CreateField",
        "model": "Command",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Command",
        "field": "updatedAt",
        "directive": "updatedAt"
      },
      {
        "stepType": "CreateModel",
        "model": "User"
      },
      {
        "stepType": "CreateField",
        "model": "User",
        "field": "id",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "User",
        "field": "id",
        "directive": "id"
      },
      {
        "stepType": "CreateField",
        "model": "User",
        "field": "guild",
        "type": "Guild",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "User",
        "field": "commands",
        "type": "Command",
        "arity": "list"
      },
      {
        "stepType": "CreateField",
        "model": "User",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "User",
        "field": "createdAt",
        "directive": "default"
      },
      {
        "stepType": "CreateDirectiveArgument",
        "model": "User",
        "field": "createdAt",
        "directive": "default",
        "argument": "",
        "value": "now()"
      },
      {
        "stepType": "CreateField",
        "model": "User",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "User",
        "field": "updatedAt",
        "directive": "updatedAt"
      },
      {
        "stepType": "CreateModel",
        "model": "Reminder"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "id",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Reminder",
        "field": "id",
        "directive": "id"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "messageId",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "user",
        "type": "User",
        "arity": "list"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "isDone",
        "type": "Boolean",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "remindAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Reminder",
        "field": "createdAt",
        "directive": "default"
      },
      {
        "stepType": "CreateDirectiveArgument",
        "model": "Reminder",
        "field": "createdAt",
        "directive": "default",
        "argument": "",
        "value": "now()"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "required"
      },
      {
        "stepType": "CreateDirective",
        "model": "Reminder",
        "field": "updatedAt",
        "directive": "updatedAt"
      },
      {
        "stepType": "CreateField",
        "model": "Guild",
        "field": "reminders",
        "type": "Reminder",
        "arity": "list"
      },
      {
        "stepType": "CreateField",
        "model": "User",
        "field": "username",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "User",
        "field": "timezone",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "guild",
        "type": "Guild",
        "arity": "required"
      }
    ],
    "stepsToApply": [
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "content",
        "type": "String",
        "arity": "required"
      },
      {
        "stepType": "CreateField",
        "model": "Reminder",
        "field": "guild",
        "type": "Guild",
        "arity": "required"
      },
      {
        "stepType": "DeleteField",
        "model": "Reminder",
        "field": "messageId"
      }
    ],
    "sourceConfig": "datasource db {\n    provider = \"postgres\"\n    url      = \"postgres://ulhascvnhtawsd:de1c0e091478eee0a76e41f223d1435a4e3d5ae3a5f1dc36a15724eeb02d1c38@ec2-174-129-255-37.compute-1.amazonaws.com:5432/d5agn6r6p90rek?sslmode=require\"\n}\n\ngenerator photon {\n    provider = \"photonjs\"\n}\n\nmodel Guild {\n    id String @id\n\n    name String\n\n    user User[]\n    commands Command[]\n    reminders Reminder[]\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel Reminder {\n    id String @id\n\n    content String\n\n    user User[]\n    guild Guild\n\n    isDone Boolean\n    remindAt DateTime\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel Channel {\n    id String @id\n\n    guild Guild\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel Command {\n    id String @id\n\n    trigger String\n    response String\n\n    user User\n    guild Guild\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}\n\nmodel User {\n    id String @id\n\n    username String\n\n    guild Guild\n    commands Command[]\n\n    timezone String\n\n    createdAt DateTime @default(now())\n    updatedAt DateTime @updatedAt\n}"
  }
}
```

## Stack Trace
```bash
Dec 12 14:59:08.194  INFO migration_engine: Starting migration engine RPC server git_hash="3c4da1d6caa0c40a0210a346ec982c77f74e18c7"
Dec 12 14:59:08.371  INFO quaint::single: Starting a postgresql pool with 1 connections.    
Dec 12 14:59:08.576  INFO ListMigrations: migration_engine::commands::list_migrations: Returning 2 migrations (0 pending).
```
