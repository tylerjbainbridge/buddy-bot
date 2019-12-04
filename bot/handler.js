import { resolvers } from "./resolvers";
import { getResolver, getMessageFromResolver, removeFromString, postToJamieReddit } from "./utils";

const resolverKeys = Object.keys(resolvers);

export const handler = client => async msg => {
  const trigger = ["rb", "roomiobot", "buddy bot", "bb"].find(trigger =>
    msg.content.toLowerCase().startsWith(trigger)
  );

  // Skip if not relevant
  if (trigger) {
    const command = removeFromString(msg.content, trigger);

    let responseMessage = "command not recognized :(";

    // Help menu
    if (msg.content.includes("help")) {
      responseMessage = `Here are the commands I support :)\n${resolverKeys
        .map(key => `\`${key}\``)
        .join("\n")}`;
    } else {
      const match = getResolver(resolvers, command);

      if (match) {
        responseMessage = await getMessageFromResolver(resolvers, match, {
          msg,
          client,
          trigger
        });
      }
    }

    if (responseMessage) {
      try {
        console.log(`command: ${handler}`);
        await msg.react("😃");
        await msg.channel.send(responseMessage);
      } catch (e) {
        console.log(e);
        await msg.react("😢");
        await msg.channel.send("something went wrong :(");
      }
    } else {
      await msg.react("🤔");
      await msg.channel.send("command not recognized :(");
    }
  }

  const filter = (reaction, user) => {
    console.log('reaction!', user.username, reaction.emoji.name)
    return ['tyler', 'jam'].includes(user.username) && ['😇'].includes(reaction.emoji.name);
  };

  const collector = msg.createReactionCollector(filter, { time: 300000 });

  collector.on('collect', r => {
    msg.channel.send(postToJamieReddit(msg.content));
    collector.stop();
  });
};
