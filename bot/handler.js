import { Command } from './classes/Command';
import { commands } from '../commands';

import { Users } from './classes/Users';

import {
  postToJamieReddit,
  postLinkToJamieReddit,
  getFlags,
  getBotChannel,
} from './utils';
import { Store } from './classes/Store';

const isProduction = process.env.NODE_ENV === 'production';

const TRIGGERS = isProduction
  ? ['bot', 'robot', 'alexa', 'rb', 'roomiobot', 'buddy bot', 'bb']
  : ['test', 't'];

export const handler = (client, photon) => async (message) => {
  const { content } = message;

  const botChannel = getBotChannel(client);

  if (message.author.bot) return;

  try {
    const { remaining: input, flags } = getFlags(content, (yargs) =>
      yargs
        .option('p', {
          alias: 'pollyVoice',
          type: 'boolean',
        })
        .option('s', {
          alias: 'speak',
          type: 'boolean',
        })
        .option('v', {
          alias: 'voice',
          type: 'boolean',
        })
    );

    const meta = {
      message,
      client,
      flags,
      photon,
    };

    meta.users = new Users(meta);
    meta.store = new Store(meta);

    const guildCommands = await meta.store.getGuildComands();

    const root = new Command({
      trigger: TRIGGERS.join('|'),
      action: (_, meta) => meta.message.react('🤔'),
      useVoiceCommand: flags.voice,
      commands: [...guildCommands, ...commands],
    });

    const success = await root.run(input, meta, {
      isStrict: true,
    });

    if (success) {
      await message.react('🆗');
    }
  } catch (e) {
    console.log(e);
    if (isProduction) {
      await message.react('😢');

      await botChannel.send(`something went wrong\n> ${content}`);
    }
  }

  const ONE_DAY = 86400000;

  if (message.author.username) {
    const collector = message.createReactionCollector(
      (reaction, user) => {
        console.log('reaction!', user.username, reaction.emoji.name);

        if (!isProduction) return reaction.emoji.name === '🤖';

        return ['😇'].includes(reaction.emoji.name);
      },
      { time: ONE_DAY }
    );

    collector.on('collect', async (r) => {
      try {
        const name = message.author.username.toLowerCase();

        if (message.attachments.size) {
          const [attachment] = [...message.attachments.values()];

          const title = message.content
            ? `"${message.content}" - ${name}`
            : `Image - ${name}`;

          const url = await postLinkToJamieReddit(title, attachment.url);

          message.channel.send(`> ${title}\n${url}`, attachment);
        } else {
          const title = message.content
            ? `"${message.content}" - ${name}`
            : name;
          const url = await postToJamieReddit(title);
          message.channel.send(`> ${title}\n${url}`);
        }
      } catch {
        message.channel.send('beep boop i broke while trying to post to tjhs');
      }

      collector.stop();
    });
  }
};
