import axios from 'axios';
import _ from 'lodash';
import {
  mentionUsernames,
  filterOutBots,
  findByUsername,
  mention,
  getResolver,
  getMessageFromResolver,
  postToJamieReddit
} from './utils';

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
  'tell jam to buy cod|you know what to do': (_, client) => {
    const jam = findByUsername(client.users, 'jam');

    return `${mention(jam)}, buy cod!`;
  },
  sandbox: () => 'https://codesandbox.io/s/github/tylerjbainbridge/buddy-bot',
  repo: () => 'https://github.com/tylerjbainbridge/buddy-bot',
  cod: (command, meta) => {
    const users = filterOutBots(meta.client.users).filter(
      ({ username }) => !BUDS_WITHOUT_COD.includes(username)
    );

    const jam = findByUsername(meta.client.users, 'jam');

    return `let's play cod ${command || 'now'}\n${mentionUsernames(
      users
    )}\n${mention(jam)} pls play with us :(`;
  },
  'boy din': (_, meta) => {
    const buds = filterOutBots(meta.client.users);
    return `boy din?\n${mentionUsernames(buds)}`;
  },
  play: async (command, meta) => {
    const voiceChannel = meta.msg.member.voiceChannel;

    if (!voiceChannel) return 'you need to be in a voice channel for this to work';

    const connection = await voiceChannel.join().catch(err => console.log(err));

    const dispatcher = connection.playArbitraryInput(`https://v-buddy-bot.s3.amazonaws.com/${command}.mp3`);

    dispatcher.on('end', () => {
      voiceChannel.leave();
    });

    return 'lol';
  }
};
