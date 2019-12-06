import axios from 'axios';
import stream from 'stream';
import fs from 'fs';

import { reddit, polly } from './config';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const findByUsername = (users, username) =>
  users.find(user => user.username === username);

export const filterOutBots = users => users.filter(({ bot }) => !bot);

export const mention = user => `<@!${user.id}>`;

export const mentionUsernames = users =>
  users.map(user => `${mention(user)}\n`);

export const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, 'i').test(content);

export const removeFromString = (string, toRemove) =>
  string.replace(new RegExp(toRemove, 'i'), '').trim();

export const getResolver = (resolvers, command) => {
  const resolverKeys = Object.keys(resolvers);

  for (let i = 0; i < resolverKeys.length; i++) {
    const base = resolverKeys[i];
    const exact = base.split('|').find(subKey => command.startsWith(subKey));

    if (exact) {
      const sub = removeFromString(command, exact);
      console.log('match', { exact, sub });
      return { base, exact, sub };
    }
  }

  return null;
};

export const getMessageFromResolver = async (resolvers, match, config) =>
  await resolvers[match.base](match.sub, config);

export const postToJamieReddit = async title => {
  try {
    const submission = await reddit
      .getSubreddit('thingsjamiehassaid')
      .submitSelfpost({ title });

    return submission.url;
  } catch (e) {
    return e.message || 'Something went wrong';
  }
};

export const playStreamFromUrl = (voiceChannel, url) =>
  new Promise(async (resolve, reject) => {
    const connection = await voiceChannel.join().catch(err => console.log(err));

    const { data: stream } = await axios.get(url, {
      responseType: 'stream',
      headers: { 'content-type': 'audio/mpeg', accept: 'audio/mpeg' }
    });

    const dispatcher = connection.playStream(stream);

    dispatcher.on('end', resolve);
    dispatcher.on('error', reject);
  });

export const tts = async (voiceChannel, text) =>
  new Promise(async (resolve, reject) => {
    const connection = await voiceChannel.join().catch(err => console.log(err));

    // const data = await polly
    //   .synthesizeSpeech({
    //     Text: text,
    //     OutputFormat: 'mp3',
    //     VoiceId: 'Joanna'
    //   })
    //   .promise();

    // // Initiate the source
    // var bufferStream = new stream.PassThrough();

    // // convert AudioStream into a readable stream
    // bufferStream.end(data.AudioStream);

    // const dispatcher = connection.playStream(stream);

    // dispatcher.on('end', resolve);
    // dispatcher.on('error', reject);
    // console.log('playStream');
    // await sleep(500);

    const data = await polly
      .synthesizeSpeech({
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Joanna'
      })
      .promise();

    const id =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);

    const filename = `./${id}.mp3`;

    fs.writeFileSync(`./${id}.mp3`, data.AudioStream);

    const stream = fs.createReadStream(filename);

    // convert AudioStream into a readable stream
    pcmStream.end(pcm.AudioStream);

    const pcmDismatcher = connection.playStream(stream);

    pcmDismatcher.on('end', resolve);
    pcmDismatcher.on('error', reject);
  });
