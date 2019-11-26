import Discord from 'discord.js';
import { TOKEN } from './token';
import { handler } from './bot/handler';

// Test
// roomioBotHandler({
//   content: 'roomiobot hi',
//   // Mocked discord API.
//   channel: {
//     send: console.log
//   },
//   author: {
//     username: 'Bob'
//   }
// });

const client = new Discord.Client();

client.once('ready', () => console.log(`Logged in as ${client.user.tag}.`));

client.on('message', handler);

client.login(TOKEN);

process.on('unhandledRejection', reason => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

require('http')
  .createServer()
  .listen(3000);
