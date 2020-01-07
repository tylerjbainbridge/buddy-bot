import { Command } from "./classes/Command";
import { commands } from "../commands";
import minimist from "minimist";

import { Users } from "./classes/Users";

import { postToJamieReddit, getFlags } from "./utils";
import { Store } from "./classes/Store";

const isProduction = process.env.NODE_ENV === "production";

const TRIGGERS = isProduction
  ? ["bot", "robot", "alexa", "rb", "roomiobot", "buddy bot", "bb"]
  : ["test"];

export const handler = (client, photon) => async message => {
  const { content } = message;

  if (message.author.bot) return;

  try {
    const { remaining: input, flags } = getFlags(content, yargs =>
      yargs
        .option("p", {
          alias: "pollyVoice",
          type: "boolean",
        })
        .option("s", {
          alias: "speak",
          type: "boolean",
        })
        .option("v", {
          alias: "voice",
          type: "boolean",
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
      trigger: TRIGGERS.join("|"),
      action: (_, meta) => meta.message.react("🤔"),
      useVoiceCommand: flags.voice,
      commands: [...guildCommands, ...commands],
    });

    const success = await root.run(input, meta, { isStrict: true });

    if (success) {
      await message.react("🤖");
    }
  } catch (e) {
    console.log(e);
    if (isProduction) {
      await message.react("😢");
      await message.channel.send("something went wrong :(");
    }
  }

  if (isProduction) {
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
  }
};
