const TRIGGER_EMOJIS = ['😇'];

export const jamieFilter = (message) => (reaction, user) => user.username === 'jam' && TRIGGER_EMOJIS.includes(reaction.emoji.name);

