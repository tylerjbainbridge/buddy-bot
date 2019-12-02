export const findByUsername = (users, username) =>
  users.find(user => user.username === username);

export const filterOutBots = users => users.filterArray(({ bot }) => !bot);

export const mention = user => `<@!${user.id}>`;

export const mentionUsernames = users =>
  users.map(user => `${mention(user)}\n`);
