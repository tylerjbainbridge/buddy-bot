import { reddit } from './config';

export const findByUsername = (users, username) =>
  users.find(user => user.username === username);

export const filterOutBots = users => users.filter(({ bot }) => !bot);

export const mention = user => `<@!${user.id}>`;

export const mentionUsernames = users =>
  users.map(user => `${mention(user)}\n`);

export const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, "i").test(content);

export const removeFromString = (string, toRemove) =>
  string.replace(new RegExp(toRemove, "g"), "").trim();

export const getResolver = (resolvers, command) => {
  const resolverKeys = Object.keys(resolvers);

  for (let i = 0; i < resolverKeys.length; i++) {
    const base = resolverKeys[i];
    const exact = base.split("|").find(subKey => test(subKey, command));

    if (exact) {
      const sub = removeFromString(command, exact);
      return { base, exact, sub };
    }
  }

  return null;
}

export const getMessageFromResolver = async (resolvers, match, config) => resolvers[match.base](match.sub, config);

export const postToJamieReddit = async (title) => {
  try {
    const submission = await reddit.getSubreddit('thingsjamiehassaid').submitSelfpost({ title });
    return `https://www.reddit.com/r/thingsjamiehassaid/comments/${submission.id}`;
  } catch (e) {
    return e.message;
  }
}