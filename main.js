import Discord from 'discord.js';
import axios from 'axios';
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
 while (true) {
   // Keep the server alive
  await sleep(1000);
  await axios.get('https://v-buddy-bot.herokuapp.com');
 }
})();

const BOT_TEST_CHANNEL_ID = '649013668373200929';

const client = new Discord.Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}.`);

  if (process.env.DYNO) {
    const channel = client.channels.get(BOT_TEST_CHANNEL_ID);
    channel.sendMessage(`Heroku RoomioBot updated DYNO: ${process.env.DYNO}:  ${process.env.SOURCE_VERSION}`);
  }
});

client.on('message', handler);

client.login(TOKEN);

process.on('unhandledRejection', reason => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

require('http')
  .createServer((request, response) => {
    response.end('Hello :)');
  })
  .listen(process.env.PORT || 3000);
