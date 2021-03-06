import _ from 'lodash';
import yargs from 'yargs';

import { reddit, BOT_TEST_CHANNEL_ID } from './config';

const isProduction = process.env.NODE_ENV === 'production';

export let submissions = null;

export const refreshTjhsPosts = async () => {
  console.log('refreshing posts...');
  submissions = await reddit
    .getSubreddit('thingsjamiehassaid')
    .getHot({ limit: 1500 });
  console.log('posts refreshed!');
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, 'i').test(content);

export const removeFromString = (string, toRemove) =>
  string.replace(new RegExp(toRemove, 'is'), '').trim();

export const getBotChannel = (client) =>
  !isProduction
    ? client.channels.cache.get(BOT_TEST_CHANNEL_ID)
    : client.channels.get(BOT_TEST_CHANNEL_ID);

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

export const postLinkToJamieReddit = async (title, url) => {
  const submission = await reddit
    .getSubreddit('thingsjamiehassaid')
    .submitLink({ title, url });

  const [_, id] = submission.name.split('_');

  refreshTjhsPosts();

  const postUrl = `https://www.reddit.com/r/thingsjamiehassaid/comments/${id}`;

  return postUrl;
};

export const postToJamieReddit = async (title) => {
  const submission = await reddit
    .getSubreddit('thingsjamiehassaid')
    .submitSelfpost({ title });

  return submission.url;
};

export const getFlags = (input, customize) => {
  const { _: parts, ...flags } = (customize ? customize(yargs) : yargs)
    .help('options')
    .parse(input);

  return { remaining: parts.join(' '), flags };
};

export const getGeneralChannel = (guild) => {
  if (guild.channels.cache.has(guild.id))
    return guild.channels.cache.get(guild.id);

  const generalChannel = guild.channels.cache.find(
    (channel) => channel.name === 'general' && channel.type !== 'voice'
  );

  return generalChannel;
};
