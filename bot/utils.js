import _ from 'lodash';
import yargs from 'yargs';

import { reddit, BOT_TEST_CHANNEL_ID } from './config';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, 'i').test(content);

export const removeFromString = (string, toRemove) =>
  string.replace(new RegExp(toRemove, 'is'), '').trim();

export const getBotChannel = (client) =>
  client.channels.cache.get(BOT_TEST_CHANNEL_ID);

export const getResolver = (resolvers, command) => {
  const resolverKeys = Object.keys(resolvers);

  for (let i = 0; i < resolverKeys.length; i++) {
    const base = resolverKeys[i];
    const exact = base.split('|').find((subKey) => command.startsWith(subKey));

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
  });

export const postToJamieReddit = async (title) => {
  try {
    const submission = await reddit
      .getSubreddit('thingsjamiehassaid')
      .submitSelfpost({ title });

    return submission.url;
  } catch (e) {
    return e.message || 'Something went wrong';
  }
};

export const getFlags = (input, customize) => {
  const { _: parts, ...flags } = (customize ? customize(yargs) : yargs)
    .help('options')
    .parse(input);

  return { remaining: parts.join(' '), flags };
};

export const getGeneralChannel = (guild) => {
  if (guild.channels.has(guild.id)) return guild.channels.get(guild.id);

  const generalChannel = guild.channels.find(
    (channel) => channel.name === 'general' && channel.type !== 'voice'
  );

  return generalChannel;
};
