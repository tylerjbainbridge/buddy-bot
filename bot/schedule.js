import Discord, { MessageAttachment } from 'discord.js';
import axios from 'axios';
import moment from 'moment-timezone';

import { sleep, getBotChannel, getGeneralChannel } from './utils';
import { OUR_GUILD_ID } from './config';

const ONE_MINUTE = 60000;
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MONDAY_MONKEY_PIC_URL =
  'https://media.discordapp.net/attachments/652152922020511757/770290567254638592/71NwPDy9KmL.png';

const FRIDAY_MONKEY_PIC_URL =
  'https://media.discordapp.net/attachments/652152922020511757/769239321286672404/image0.png';

export const runSchedule = async (client) => {
  const guild = client.guilds.cache.get(OUR_GUILD_ID);

  const generalChannel = getGeneralChannel(guild);

  while (true) {
    const dateStr = moment().tz('America/New_York').format('dddd|h:mm a');

    const [dayOfWeek, timeofDay] = dateStr.split('|');

    switch (timeofDay) {
      case '9:30 am': {
        switch (dayOfWeek) {
          case 'Monday': {
            generalChannel.send(
              'happy monday monkey!!!',
              new MessageAttachment(MONDAY_MONKEY_PIC_URL)
            );

            return;
          }
          case 'Friday': {
            generalChannel.send(
              `IT'S FRIDAY! BABOON DANCE!`,
              new MessageAttachment(FRIDAY_MONKEY_PIC_URL)
            );

            return;
          }
        }
      }
    }

    await sleep(ONE_MINUTE);
  }
};
