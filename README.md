# buddy-bot

Add a command to the `commands.js` file-

A command works like so:

```js
new Command({
  trigger: 'list|ls',

  // All commands must either supply an action or response.
  action: (subCommand, meta) => {
    // Actions dont need to return anything- you manually handle message replies, voice, etc
  },

  // Response is for simple message replies- it can be a function (async) or a string.
  response: '',
  response: (subCommand, meta) => '',

  // Each command can take an array of commands- these are options for the parent command
  commands: [
    new Resolve({
      trigger: 'add',
      // Add to list
      action: () => {},
    })
  ]
});
```

Note: ./temp is for storing temporary audio files- do not delete.
