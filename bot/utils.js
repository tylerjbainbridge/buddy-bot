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

export const getHandler = async (resolvers, command) => {
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
