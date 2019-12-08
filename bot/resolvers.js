import axios from 'axios';
import _ from 'lodash';

import {
  getResolver,
  getMessageFromResolver,
  postToJamieReddit
} from './utils';

import { Voice } from './Voice';

import { reddit, WEATHER_APP_ID, BUDS_WITHOUT_COD } from './config.js';

export const resolvers = {
  'hello|hi': (_, meta) =>
    `hey ${meta.msg.author.username || ''}! im your bot bud`,
  'freaks me out': () => ':(',
  help: () => `heh just kidding, you gotta find em yourself :)`,
  'beep boop': () => `i am a robot`,
  'things jamie has said|thingsjamiehassaid|tjhs': async (command, config) => {
    const resolvers = {
      add: title => postToJamieReddit(title),
      'delete last': async () => {
        const latestPost = await reddit
          .getSubreddit('thingsjamiehassaid')
          .getNew()[0];

        await latestPost.delete();

        return `Deleted\n> ${latestPost.title}`;
      }
    };

    const match = getResolver(resolvers, command);

    if (match) {
      return await getMessageFromResolver(resolvers, match, config);
    }

    // Default: get random
    const submission = reddit
      .getSubreddit('thingsjamiehassaid')
      .getRandomSubmission();

    return submission.title;
  },
  gif: async command => {
    const {
      data: {
        data: { image_url: gif }
      }
    } = await axios.get(
      `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${command}`
    );

    if (!gif) return 'no gif found :(';

    return gif;
  },
  'kegparty|give me a beer|random beer|beer': async () => {
    const { data } = await axios.get(
      'http://kegparty.herokuapp.com/api/random'
    );

    const {
      link,
      name,
      style: { name: styleName, description }
    } = data;

    return `Courtesy of Key Party\n\n\nName: ${name}\n\n\nStyle: ${styleName}\n\n\nDescription: ${description}\n\n\nMore info: ${link}`;
  },
  'weather in': async command => {
    const { data: weatherData } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_APP_ID}&q=${command}`
    );

    if (!weatherData) return 'no weather found :(';

    return weatherData.weather.pop().description;
  },
  'fun fact|funfact': async () => {
    const { data } = await axios.get('http://numbersapi.com/random');

    return data;
  },
  'tj|thomas': () => _.sample(['dj*', 'terry*', 'tom*']),
  'home|house|github|gh|The Hub': () => `it's public ;)`,
  sucks: () => 'no you do :smile:',
  'did you love it did you hate it': () => 'what would you rate it?',
  "you're the best, you're the best": () => 'what should _I_ review next?',
  'tell jam to buy cod|you know what to do': (_, meta) => {
    const jam = meta.users.findByUsername('jam');

    return `${mention(jam)}, buy cod!`;
  },
  sandbox: () => 'https://codesandbox.io/s/github/tylerjbainbridge/buddy-bot',
  repo: () => 'https://github.com/tylerjbainbridge/buddy-bot',
  cod: (command, meta) => {
    const codBuds = meta.users
      .filterOutBots()
      .filter(({ username }) => !BUDS_WITHOUT_COD.includes(username));

    const jam = meta.users.findByUsername('jam');

    return `let's play cod ${command ||
      'now'}\n${meta.users.getBatchUserMention(codBuds)}\n${mention(
      jam
    )} pls play with us :(`;
  },
  'boy din': (_, meta) => {
    const buds = meta.users.filterOutBots();
    return `boy din?\n${meta.users.getBatchUserMention(buds)}`;
  },
  play: async (fileName, meta) => {
    const voice = new Voice(meta);

    await voice.connect();

    await voice.playFileFromBucket(fileName);
  },
  say: async (text, meta) => {
    const voice = new Voice(meta);

    await voice.connect();

    await voice.talk(text);
  },
  voice: async (_, meta) => {
    const voice = new Voice(meta);

    await voice.connect();

    const command = await voice.listen();

    switch (command) {
      case 'hello robot':
        await voice.talk('hello human');
        break;
      case 'play corner':
        await await voice.playFileFromBucket('corner');
        break;
      default:
        await voice.talk(`beep boop i don't understand`);
    }
  }
};
