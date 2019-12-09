import { Command } from "./classes/Command";
import { commands } from "../commands";
import minimist from "minimist";

import { Users } from "./classes/Users";

import { postToJamieReddit } from "./utils";

const TRIGGERS = [
  "bot",
  "robot",
  "alexa",
  "rb",
  "roomiobot",
  "buddy bot",
  "bb",
];

export const handler = client => async message => {
  const { content } = message;

  const root = new Command({
    trigger: TRIGGERS.join("|"),
    message: "command not found.",
    commands,
  });

  try {
    const { _: parts, ...flags } = minimist(content.split(" "), {
      string: ["pollyVoice"],
      boolean: ["silent"],
      alias: { s: "silent" },
    });

    await root.run(parts.join(" ").toLowerCase(), {
      message,
      client,
      flags,
      users: new Users({ client, message }),
    });
  } catch (e) {
    console.log(e);
    await message.react("😢");
    await message.channel.send("something went wrong :(");
  }

  if (["tyler", "jam"].includes(message.author.username.toLowerCase())) {
    const ONE_HOUR = 3600000;

    const collector = message.createReactionCollector(
      (reaction, user) => {
        console.log("reaction!", user.username, reaction.emoji.name);
        return ["😇"].includes(reaction.emoji.name);
      },
      { time: ONE_HOUR }
    );

    collector.on("collect", async r => {
      const url = await postToJamieReddit(message.content);
      message.channel.send(`> ${message.content}\n${url}`);
      collector.stop();
    });
  }
};
