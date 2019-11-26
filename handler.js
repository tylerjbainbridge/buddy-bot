const resolvers = require('./resolvers');

const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, 'i').test(content);

export const roomioBotHandler = async msg => {
  if (msg.content.toLowerCase() === ' ') msg.reply('hi bud!');

  const isRoomioMessage = ['rb', 'roomiobot', 'buddy boy'].some(trigger =>
    msg.content.startsWith(trigger)
  );

  if (!isRoomioMessage) {
    return;
  }

  const matches = Object.keys(resolvers).filter(key => {
    return key.split('|').filter(subKey => {
      return test(subKey, msg.content);
    }).length;
  });

  if (matches.length) {
    try {
      const command = matches.shift();
      console.log(`command: ${command}`);
      await msg.channel.send(await resolvers[command](msg));
    } catch (e) {
      console.log(e);
      await msg.channel.send('something went wrong :(');
    }
  } else {
    await msg.channel.send('command not recognized :(');
  }
};
