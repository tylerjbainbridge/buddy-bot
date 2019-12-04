import { resolvers } from './resolvers';
import {
  getResolver,
  getMessageFromResolver,
  removeFromString,
  postToJamieReddit
} from './utils';

const TRIGGERS = [
  'bot',
  'robot',
  'alexa',
  'rb',
  'roomiobot',
  'buddy bot',
  'bb'
];

const resolverKeys = Object.keys(resolvers);

export const handler = client => async msg => {
  const trigger = TRIGGERS.find(trigger =>
    msg.content.toLowerCase().startsWith(trigger)
  );

  // Skip if not relevant
  if (trigger) {
    const command = removeFromString(msg.content, trigger);

    let responseMessage = 'command not recognized :(';

    // Help menu
    if (msg.content.includes('triggers')) {
      responseMessage = `I respond to\n${TRIGGERS.map(key => `\`${key}\``).join(
        '\n'
      )}`;
    } else if (msg.content.includes('help')) {
      responseMessage = `Here are the commands I support :)\n${resolverKeys
        .map(key => `\`${key}\``)
        .join('\n')}`;
    } else {
      const match = getResolver(resolvers, command);

      if (match) {
        console.log(`command: ${match.base}`);
        responseMessage = await getMessageFromResolver(resolvers, match, {
          msg,
          client,
          trigger
        });
      }
    }

    if (responseMessage) {
      try {
        await msg.react('😃');
        await msg.channel.send(responseMessage);
      } catch (e) {
        console.log(e);
        await msg.react('😢');
        await msg.channel.send('something went wrong :(');
      }
    } else {
      await msg.react('🤔');
      await msg.channel.send('command not recognized :(');
    }
  }

  if (['tyler', 'jam'].includes(msg.author.username.toLowerCase())) {
    const ONE_HOUR = 3600000;

    const collector = msg.createReactionCollector(
      (reaction, user) => {
        console.log('reaction!', user.username, reaction.emoji.name);
        return ['😇'].includes(reaction.emoji.name);
      },
      { time: ONE_HOUR }
    );

    collector.on('collect', async r => {
      const url = await postToJamieReddit(msg.content);
      msg.channel.send(`> ${msg.content}\n${url}`);
      collector.stop();
    });
  }
};
