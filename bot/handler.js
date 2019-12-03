import { resolvers } from "./resolvers";
import { test, removeFromString } from "./utils";

const resolverKeys = Object.keys(resolvers);

export const handler = client => async msg => {
  if (msg.content.toLowerCase() === " ") msg.reply("hi bud!");

  const trigger = ["rb", "roomiobot", "buddy bot", "bb"].find(trigger =>
    msg.content.toLowerCase().startsWith(trigger)
  );

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
    let handler;

    for (let i = 0; i < resolverKeys.length; i++) {
      const base = resolverKeys[i];
      const exact = base.split("|").find(subKey => test(subKey, command));

      if (exact) {
        handler = { base, exact };
        break;
      }
    }

    if (handler) {
      const subCommand = removeFromString(command, handler.exact);

      responseMessage = await resolvers[handler.base](subCommand, {
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
