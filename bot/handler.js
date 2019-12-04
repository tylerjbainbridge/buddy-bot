import { resolvers } from "./resolvers";
import {
  getResolver,
  getMessageFromResolver,
  removeFromString,
  postToJamieReddit
} from "./utils";

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
    console.log("reaction!", user.username, reaction.emoji.name);
    return (
      ["jam"].includes(user.username.toLowerCase()) &&
      ["😇"].includes(reaction.emoji.name)
    );
  };

  const ONE_HOUR = 3600000;

  const collector = msg.createReactionCollector(filter, { time: ONE_HOUR });

  collector.on("collect", async r => {
    msg.channel.send(await postToJamieReddit(msg.content));
    collector.stop();
  });
};
