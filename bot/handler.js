import { resolvers } from "./resolvers";

const resolverKeys = Object.keys(resolvers);

const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, "i").test(content);

export const handler = async msg => {
  if (msg.content.toLowerCase() === " ") msg.reply("hi bud!");

  const isRoomioMessage = ["rb", "roomiobot", "buddy bot", "bb"].some(trigger =>
    msg.content.toLowerCase().startsWith(trigger)
  );

  // Skip if not relevant
  if (!isRoomioMessage) return;

  let responseMessage = "command not recognized :(";

  // Help menu
  if (msg.content.includes("help")) {
    responseMessage = `Here are the commands I support :)\n ${resolverKeys.join(
      "\n"
    )}`;
  } else {
    const handler = resolverKeys.find(key =>
      key.split("|").find(subKey => test(subKey, msg.content))
    );

    if (handler) {
      responseMessage = await resolvers[handler](msg);
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
