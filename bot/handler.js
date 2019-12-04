import { resolvers } from "./resolvers";
import { getResolver, getMessageFromResolver, removeFromString } from "./utils";

const resolverKeys = Object.keys(resolvers);

export const handler = client => async msg => {
  const trigger = ["rb", "roomiobot", "buddy bot", "bb"].find(trigger =>
    msg.content.toLowerCase().startsWith(trigger)
  );

  console.log('hello');


  // Skip if not relevant
  if (!trigger) return;

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
      console.log(resolverKeys, match)
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
};
