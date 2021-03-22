require('dotenv').config();

import Discord from 'discord.js';
import axios from 'axios';
import moment from 'moment-timezone';

import { sleep, getBotChannel, refreshTjhsPosts } from './bot/utils';
import { handler } from './bot/handler';
import { photon } from './bot/config';
import { runSchedule } from './bot/schedule';

moment.tz.setDefault('America/New_York');

const FIFTEEN_MINUTES = 900000;

process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

export const client = new Discord.Client();

if (process.env.DYNO) {
  (async () => {
    while (true) {
      // Ping the heroku app at random intervals to keep it from sleeping
      const sleepTime = Math.floor(Math.random() * FIFTEEN_MINUTES) + 1;
      await sleep(sleepTime);
      await axios.get('https://v-buddy-bot.herokuapp.com');
    }
  })();
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}.`);

  const channel = getBotChannel(client);

  if (process.env.DYNO) {
    const date = moment().tz('America/New_York').format('M/D/YYYY, h:mm:ss a');

    channel.send(`beep boop BuddyBot updated (${date})`);

    // Log when the script is shutting down.
    process.on('SIGTERM', function () {
      channel.send(`BuddyBot offline (updating)`);
    });
  }

  runSchedule(client);
  refreshTjhsPosts();

  // await Promise.all(jobs.map((job) => job(client, photon)));
});

client.on('message', handler(client, photon));

client.on('error', console.error);

client.login(process.env.TOKEN);

require('http')
  .createServer((_, response) => {
    response.end('Hello :)');
  })
  .listen(process.env.PORT || 3000);
