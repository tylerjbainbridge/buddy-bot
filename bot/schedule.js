import { MessageAttachment } from 'discord.js';
import moment from 'moment-timezone';

import { sleep, getBotChannel, getGeneralChannel } from './utils';
import { OUR_GUILD_ID } from './config';

const ONE_MINUTE = 60000;
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MONDAY_MONKEY_PIC_URL =
  'https://media.discordapp.net/attachments/652152922020511757/770290567254638592/71NwPDy9KmL.png';

const FRIDAY_MONKEY_PIC_URL =
  'https://media.discordapp.net/attachments/652152922020511757/769239321286672404/image0.png';

const FUNKY_MONKEY_FRIDAY_URL = 'https://i.imgur.com/TUrYck9.jpg';

export const runSchedule = async (client) => {
  const guild = await client.guilds.cache.get(OUR_GUILD_ID);

  const generalChannel = getGeneralChannel(guild);

  const botChannel = getBotChannel(client);

  while (true) {
    const dateStr = moment().tz('America/New_York').format('dddd|h:mm a');

    // botChannel.send('test', new MessageAttachment(FUNKY_MONKEY_FRIDAY_URL));

    const [dayOfWeek, timeofDay] = dateStr.split('|');

    switch (timeofDay) {
      case '12:00 am': {
        switch (dayOfWeek) {
          case 'Friday': {
            generalChannel.send(
              'FONKY MONKY FRIDAY',
              new MessageAttachment(FUNKY_MONKEY_FRIDAY_URL)
            );

            return;
          }
        }
      }

      case '9:00 am': {
        generalChannel.send('gm');

        return;
      }

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

      // case '5:00 pm': {
      //   if (WEEKDAYS.includes(dayOfWeek)) {
      //     generalChannel.send(
      //       `stop working!! it's 5pm`,
      //       new MessageAttachment('https://i.imgur.com/46mKI0H.jpg')
      //     );
      //   }

      //   return;
      // }
    }

    await sleep(ONE_MINUTE);
  }
};
