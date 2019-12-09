import axios from 'axios';
import _ from 'lodash';

import { postToJamieReddit } from './bot/utils';

import { Command } from './bot/classes/Command';
import { Voice } from './bot/classes/Voice';

import { reddit, WEATHER_APP_ID, BUDS_WITHOUT_COD, POLLY_VOICES } from './bot/config.js';

export const commands = [
  new Command({
    trigger: 'hello|hi',
    response: (_, meta) =>
      `hey ${meta.message.author.username || ''}! im your bot bud`
  }),

  new Command({
    trigger: 'freaks me out',
    response: ':('
  }),

  new Command({
    trigger: 'beep boop',
    response: 'i am a robot'
  }),

  new Command({
    trigger: 'home|house|github|gh|The Hub',
    response: `it's public ;)`
  }),

  new Command({
    trigger: 'sucks',
    response: 'no you do :smile:'
  }),

  new Command({
    trigger: 'did you love it did you hate it',
    response: 'what would you rate it?'
  }),

  new Command({
    trigger: "you're the best, you're the best",
    response: 'what should _I_ review next?'
  }),

  new Command({
    trigger: "list voices",
    response: POLLY_VOICES.map((voice) => `\`${voice}\``).join('\n')
  }),

  new Command({
    trigger: 'sandbox',
    response: 'https://codesandbox.io/s/github/tylerjbainbridge/buddy-bot'
  }),

  new Command({
    trigger: 'repo',
    response: 'https://github.com/tylerjbainbridge/buddy-bot'
  }),

  new Command({
    trigger: 'things jamie has said|thingsjamiehassaid|tjhs',
    response: async () => {
      // Default: get random
      const submission = reddit
        .getSubreddit('thingsjamiehassaid')
        .getRandomSubmission();

      return submission.title;
    },
    commands: [
      new Command({
        trigger: 'add',
        response: title => postToJamieReddit(title)
      }),

      new Command({
        trigger: 'delete last',
        response: async () => {
          const latestPost = await reddit
            .getSubreddit('thingsjamiehassaid')
            .getNew()[0];

          await latestPost.delete();

          return `Deleted\n> ${latestPost.title}`;
        }
      })
    ]
  }),

  new Command({
    trigger: 'gif',
    response: async input => {
      const {
        data: {
          data: { image_url: gif }
        }
      } = await axios.get(
        `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${input}`
      );

      if (!gif) return 'no gif found :(';

      return gif;
    }
  }),

  new Command({
    trigger: 'kegparty|give me a beer|random beer|beer',
    response: async () => {
      const { data } = await axios.get(
        'http://kegparty.herokuapp.com/api/random'
      );

      const {
        link,
        name,
        style: { name: styleName, description }
      } = data;

      return `Courtesy of Key Party\n\n\nName: ${name}\n\n\nStyle: ${styleName}\n\n\nDescription: ${description}\n\n\nMore info: ${link}`;
    }
  }),

  new Command({
    trigger: 'weather in',
    response: async input => {
      const { data: weatherData } = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_APP_ID}&q=${input}`
      );

      if (!weatherData) return 'no weather found :(';

      return weatherData.weather.pop().description;
    }
  }),

  new Command({
    trigger: 'fun fact|funfact',
    response: async () => {
      const { data } = await axios.get('http://numbersapi.com/random');

      return data;
    }
  }),

  new Command({
    trigger: 'tj|thomas',
    response: () => _.sample(['dj*', 'terry*', 'tom*'])
  }),

  new Command({
    trigger: 'tell jam to buy cod|you know what to do',
    response: (_, meta) => {
      const jam = meta.users.findByUsername('jam');
      return `${meta.users.getUserMention(jam)}, buy cod!`;
    }
  }),

  new Command({
    trigger: 'cod',
    response: (input, meta) => {
      const codBuds = meta.users
        .filterOutBots()
        .filter(({ username }) => !BUDS_WITHOUT_COD.includes(username));

      const jam = meta.users.findByUsername('jam');

      return `let's play cod ${input ||
        'now'}\n${meta.users.getBatchUserMention(
        codBuds
      )}\n${meta.users.getUserMention(jam)} pls play with us :(`;
    }
  }),

  new Command({
    trigger: 'boy din',
    response: (_, meta) => {
      const buds = meta.users.filterOutBots();
      return `boy din?\n${meta.users.getBatchUserMention(buds)}`;
    }
  }),

  new Command({
    trigger: 'play',
    action: async (fileName, meta) => {
      const voice = new Voice(meta);

      await voice.connect();

      await voice.playFileFromBucket(fileName);
    }
  }),

  new Command({
    trigger: 'say',
    action: async (text, meta) => {
      const voice = new Voice(meta);

      await voice.connect();

      await voice.talk(text);
    }
  }),

  new Command({
    trigger: 'voice',
    useVoiceCommand: true,
    response: 'beep boop, i dont understand',
    commands: [
      new Command({
        trigger: 'hello robot',
        response: 'hello human'
      }),
      new Command({
        trigger: 'play corner',
        action: async (_, meta) => {
          await meta.voice.playFileFromBucket('corner');
        }
      })
    ]
  })
];
