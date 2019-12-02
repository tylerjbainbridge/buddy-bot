export const mentionUsernames = users => users.map(({ id }) => `<@!${id}>\n`);
