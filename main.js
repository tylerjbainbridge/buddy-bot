import Discord from 'discord.js';
import { TOKEN } from './token';
import { roomioBotHandler } from './handler';

roomioBotHandler({
  content: 'roomiobots hi',
  // Mocked discord API.
  channel: {
    send: console.log
  },
  author: {
    username: 'Bob'
  }
});

const client = new Discord.Client();

client.once('ready', () => console.log(`Logged in as ${client.user.tag}.`));

client.on('message', async msg => {
  return await roomioBotHandler(msg);
});

client.login(TOKEN);

require('http')
  .createServer()
  .listen(3000);
