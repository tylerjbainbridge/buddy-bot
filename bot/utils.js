import axios from 'axios';
import streamBuffers from 'stream-buffers';

import { reddit, polly } from './config';

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

    const data = await polly
      .synthesizeSpeech({
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Joanna'
      })
      .promise();

    const stream = new streamBuffers.ReadableStreamBuffer({
      frequency: 10, // in milliseconds.
      chunkSize: 2048 // in bytes.
    });

    stream.put(data.AudioStream);

    const dispatcher = connection.playStream(stream);

    dispatcher.on('end', resolve);
    dispatcher.on('error', reject);
  });
