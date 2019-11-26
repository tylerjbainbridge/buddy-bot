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

const BOT_TEST_CHANNEL_ID = '649013668373200929';

const client = new Discord.Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}.`);
  const channel = client.channels.get(BOT_TEST_CHANNEL_ID);
  channel.sendMessage('New version of Roomio Bot ready!');
});

client.on('message', handler);

client.login(TOKEN);

process.on('unhandledRejection', reason => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

require('http')
  .createServer()
  .listen(process.env.PORT || 3000);
