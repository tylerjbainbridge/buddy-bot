import { resolvers } from './resolvers';

const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, 'i').test(content);

export const handler = async msg => {
  if (msg.content.toLowerCase() === ' ') msg.reply('hi bud!');

  const isRoomioMessage = ['rb', 'roomiobot', 'buddy bot', 'bb'].some(trigger =>
    msg.content.startsWith(trigger)
  );

  // Skip if not relevant
  if (!isRoomioMessage) return;

  const handler = Object.keys(resolvers).find(
    key => key.split('|').filter(subKey => test(subKey, msg.content)).length
  );

  if (handler) {
    try {
      console.log(`command: ${handler}`);
      await msg.channel.send(await resolvers[handler](msg));
    } catch (e) {
      console.log(e);
      await msg.channel.send('something went wrong :(');
    }
  } else {
    await msg.channel.send('command not recognized :(');
  }
};
