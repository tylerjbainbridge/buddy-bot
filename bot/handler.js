import { Command } from './classes/Command';
import { commands } from '../commands';
import minimist from 'minimist';

import { Users } from './classes/Users';

import { postToJamieReddit } from './utils';

const TRIGGERS = [
  'bot',
  'robot',
  'alexa',
  'rb',
  'roomiobot',
  'buddy bot',
  'bb'
];

export const handler = client => async message => {
  const input = message.content.toLowerCase();

  const root = new Command({
    trigger: TRIGGERS.join('|'),
    message: 'command not found.',
    commands
  });

  try {
    await root.run(input, {
      message,
      client,
      users: new Users({ client, message }),
      flags: minimist(input.split(' '), {
        string: ['pollyVoice'],
        boolean: ['silent'],
        alias: { s: 'silent' }
      })
    });
  } catch (e) {
    console.log(e);
    await message.react('😢');
    await message.channel.send('something went wrong :(');
  }

  if (['tyler', 'jam'].includes(message.author.username.toLowerCase())) {
    const ONE_HOUR = 3600000;

    const collector = message.createReactionCollector(
      (reaction, user) => {
        console.log('reaction!', user.username, reaction.emoji.name);
        return ['😇'].includes(reaction.emoji.name);
      },
      { time: ONE_HOUR }
    );

    collector.on('collect', async r => {
      const url = await postToJamieReddit(message.content);
      message.channel.send(`> ${message.content}\n${url}`);
      collector.stop();
    });
  }
};
