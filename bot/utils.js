import axios from 'axios';
import { promisify } from 'util';
import fs from 'fs';
import _ from 'lodash';
import minimist from 'minimist';

const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

import { reddit, polly, speechToText, BOT_TEST_CHANNEL_ID } from './config';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const findByUsername = (users, username) =>
  users.find(user => user.username.toLowerCase() === username.toLowerCase());

export const filterOutBots = users => users.filter(({ bot }) => !bot);

export const mention = user => `<@!${user.id}>`;

export const mentionUsernames = users =>
  users.map(user => `${mention(user)}\n`);

export const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, 'i').test(content);

export const removeFromString = (string, toRemove) =>
  string.replace(new RegExp(toRemove, 'i'), '').trim();

export const getBotChannel = client => client.channels.get(BOT_TEST_CHANNEL_ID);

export const joinCurrentVoiceChannel = async meta => {
  const voiceChannel = meta.msg.member.voice.channel;

  if (!voiceChannel) {
    meta.msg.channel.send(`Join a voice channel and try again`);
    throw 'User not in voice channel';
  }

  return await voiceChannel.join();
};

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

export const getMessageFromResolver = async (resolvers, match, meta) =>
  await resolvers[match.base](match.sub, {
    ...meta,
    flags: minimist(match.sub.split(' '), {
      boolean: ['silent'],
      alias: { s: 'silent' }
    })
  });

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

export const playStreamFromUrl = (connection, url) =>
  new Promise(async (resolve, reject) => {
    const { data: stream } = await axios.get(url, {
      responseType: 'stream',
      headers: { 'content-type': 'audio/mpeg', accept: 'audio/mpeg' }
    });

    const dispatcher = connection.play(stream);

    dispatcher.on('end', resolve);
    dispatcher.on('error', reject);
  });

export const playFileFromBucket = async (connection, fileName) => {
  await playStreamFromUrl(
    connection,
    `https://v-buddy-bot.s3.amazonaws.com/${fileName}.mp3`
  );
};

export const talk = async (connection, text, meta) =>
  new Promise(async (resolve, reject) => {
    if (meta.flags.silent) return resolve();

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

    await writeFileAsync(filename, data.AudioStream);

    const dispatchers = connection.play(filename);

    dispatchers.on('end', async () => {
      await unlinkAsync(filename);
      resolve();
    });

    dispatchers.on('error', reject);
  });

export const listen = (connection, meta) =>
  new Promise(async (resolve, reject) => {
    // 16-bit signed PCM, stereo 48KHz stream
    const pcmStream = connection.receiver.createStream(meta.msg.author, {
      mode: 'pcm',
      end: 'silence'
    });

    // pcmStream.pipe(fs.createWriteStream(__dirname + `/${Date.now()}.pcm`));

    // create the stream
    const recognizeStream = speechToText.recognizeUsingWebSocket({
      model: 'en-US_BroadbandModel',
      contentType: 'audio/l16;rate=48000;channels=2',
      interimResults: true,
      inactivityTimeout: -1
    });

    await talk(connection, `I'm Listening...`, meta);
    await playFileFromBucket(connection, 'beep');

    pcmStream.pipe(recognizeStream);

    meta.msg.channel.send('Listening...');

    pcmStream.on(
      'data',
      _.throttle(() => {
        console.log('user is speaking');
      }, 1000)
    );

    pcmStream.on('error', function(event) {
      console.log('uh oh!');
    });

    pcmStream.on('close', function(event) {
      console.log('user is done speaking');
    });

    // Backup timeout.
    // setTimeout(() => {
    //   pcmStream.destroy();
    // }, 5000);

    // // pipe in some audio
    // fs.createReadStream(__dirname + '/test.wav').pipe(recognizeStream);

    recognizeStream.on('data', function(event) {
      const text = event.toString();

      onEvent('Data:', text);

      getBotChannel(meta.client).send(
        `I heard ${meta.msg.author.username} say: ${text}`
      );

      // Cleanup
      pcmStream.destroy();

      // Resolve promise with the detected text
      resolve(text.trim());
    });

    recognizeStream.on('error', function(event) {
      onEvent('Error:', event);
      getBotChannel(meta.client).send('Error processing audio.');
      reject();
    });

    recognizeStream.on('close', function(event) {
      onEvent('Close:', event);
      getBotChannel(meta.client).send('Watson exit.');
    });

    // Displays events on the console.
    function onEvent(name, event) {
      console.log(name, JSON.stringify(event, null, 2));
    }
  });
