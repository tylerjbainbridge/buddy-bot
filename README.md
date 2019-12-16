# buddy-bot

A Discord bot for our group chat.

Capable of handling voice commands and responding with speech. See `commands.js` for a full list.

Each guild can have it's own custom commands

`bb guild commands add -t "trigger here" -r "response here"`

BuddyBoy is also capable of handling timezone agnostic reminders

`bb remind me to make dinner plans in tomorrow at noon`

> I will remind you to "make dinner plans" tomorrow at 12pm.

Running locally requires a .env file with the proper variables + a discord bot key.
Contact me for a .env file that will allow for local dev.

## To add a new command

Add a command to the `commands.js` file-

A command works like so:

```js
new Command({
  trigger: 'list|ls',

  // All commands must either supply an action or response.

  
  // Actions dont need to return anything- you manually handle message replies, voice, etc
  action: (subCommand, meta) => any,

  // Response is for simple message replies- it can be a function (async) or a string.
  response: '',
  response: (subCommand, meta) => '',

  // Each command can take an array of sub commands- these are options for the parent command
  commands: [
    new Resolve({
      trigger: 'add',
      // Add to list here
      action: () => {},
    })
  ]
});
```
