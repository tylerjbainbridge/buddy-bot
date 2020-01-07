import axios from "axios";
import { sample } from "lodash";

import { postToJamieReddit, removeFromString } from "./bot/utils";

import { Command } from "./bot/classes/Command";
import { Voice } from "./bot/classes/Voice";

import {
  reddit,
  WEATHER_APP_ID,
  BUDS_WITHOUT_COD,
  POLLY_VOICES,
} from "./bot/config.js";

export const commands = [
  new Command({
    trigger: "hello|hi|hello robot",
    response: (_, meta) =>
      sample([
        `hey ${meta.message.author.username ||
          ""}! my name is buddy bot...beep boop...haha`,
        "hello human",
      ]),
  }),

  new Command({
    trigger: "freaks me out",
    response: ":(",
  }),

  new Command({
    trigger: "beep boop",
    response: "i am a robot",
  }),

  new Command({
    trigger: "home|house|github|gh|The Hub",
    response: `it's public ;)`,
  }),

  new Command({
    trigger: "sing your song",
    response: "buddy boy buddy boy whatcha gonna do when they come for u!",
  }),

  new Command({
    trigger: "sucks",
    response: "no you do :smile:",
  }),

  new Command({
    trigger: "did you love it did you hate it",
    response: "what would you rate it?",
  }),

  new Command({
    trigger: "you're the best, you're the best",
    response: "what should _I_ review next?",
  }),

  new Command({
    trigger: "list voices",
    response: POLLY_VOICES.map(voice => `\`${voice}\``).join("\n"),
  }),

  new Command({
    trigger: "sandbox",
    response: "https://codesandbox.io/s/github/tylerjbainbridge/buddy-bot",
  }),

  new Command({
    trigger: "repo",
    response: "https://github.com/tylerjbainbridge/buddy-bot",
  }),

  new Command({
    trigger: "things jamie has said|thingsjamiehassaid|tjhs",
    response: async () => {
      // Default: get random
      const submission = reddit
        .getSubreddit("thingsjamiehassaid")
        .getRandomSubmission();

      return [" - Jamie", "- Jamie"].reduce((p, c) => {
        return removeFromString(p, c);
      }, await submission.title);
    },
    commands: [
      new Command({
        trigger: "add",
        response: title => postToJamieReddit(title),
      }),

      new Command({
        trigger: "delete last",
        response: async () => {
          const latestPost = await reddit
            .getSubreddit("thingsjamiehassaid")
            .getNew()[0];

          await latestPost.delete();

          return `Deleted\n> ${latestPost.title}`;
        },
      }),
    ],
  }),

  new Command({
    trigger: "gif",
    response: async input => {
      const {
        data: {
          data: { image_url: gif },
        },
      } = await axios.get(
        `http://api.giphy.com/v1/gifs/random?api_key=mCVyzEu7SHtORmw1wtVoxDJY5jd6h4aX&tag=${input}`
      );

      if (!gif) return "no gif found :(";

      return gif;
    },
  }),

  new Command({
    trigger: "kegparty|give me a beer|random beer|beer",
    response: async () => {
      const { data } = await axios.get(
        "http://kegparty.herokuapp.com/api/random"
      );

      const {
        link,
        name,
        style: { name: styleName, description },
      } = data;

      return `Courtesy of Key Party\n\n\nName: ${name}\n\n\nStyle: ${styleName}\n\n\nDescription: ${description}\n\n\nMore info: ${link}`;
    },
  }),

  new Command({
    trigger: "weather in",
    response: async input => {
      const { data: weatherData } = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_APP_ID}&q=${input}`
      );

      if (!weatherData) return "no weather found :(";

      return weatherData.weather.pop().description;
    },
  }),

  new Command({
    trigger: "fun fact|funfact",
    flagValues: {
      pollyVoice: "Ivy",
    },
    response: async () => {
      const { data } = await axios.get("http://numbersapi.com/random");

      return data;
    },
  }),

  new Command({
    trigger: "tj|thomas",
    response: () => sample(["dj*", "terry*", "tom*"]),
  }),

  new Command({
    trigger: "tell jam to buy cod|you know what to do",
    response: (_, meta) => {
      const jam = meta.users.findByUsername("jam");

      return `${meta.users.getUserMention(jam)}, buy cod!`;
    },
  }),

  new Command({
    trigger: "cod",
    response: (input, meta) => {
      const codBuds = meta.users
        .filterOutBots()
        .filter(({ username }) => !BUDS_WITHOUT_COD.includes(username));

      const jam = meta.users.findByUsername("jam");

      return `let's play cod ${input ||
        "now"}\n${meta.users.getBatchUserMention(
        codBuds
      )}\n${meta.users.getUserMention(jam)} pls play with us :(`;
    },
  }),

  new Command({
    trigger: "boy din",
    response: (_, meta) => {
      const buds = meta.users.filterOutBots();
      return `boy din?\n${meta.users.getBatchUserMention(buds)}`;
    },
  }),

  new Command({
    trigger: "play",
    action: async (fileName, meta) => {
      const voice = new Voice(meta);

      await voice.connect();

      await voice.playFileFromBucket(fileName);
    },
  }),

  new Command({
    trigger: "say",
    action: async (text, meta) => {
      const voice = new Voice(meta);

      await voice.connect();

      await voice.speak(text);
    },
  }),

  new Command({
    trigger: "remind",
    commands: [
      new Command({
        trigger: "me to|me that|me",
        response: async (input, meta) => {
          const { relativeDateStr, content } = await meta.store.addReminder(
            input,
            meta
          );

          return `Reminding you ${relativeDateStr.toLowerCase()} - "${content}"`;
        },
      }),
    ],
  }),

  new Command({
    trigger: "guild",
    commands: [
      new Command({
        trigger: "sync",
        action: async (input, meta) => {
          await meta.store.syncGuild();
        },
      }),
      new Command({
        trigger: "commands",
        commands: [
          new Command({
            trigger: "add",
            yargs: yargs =>
              yargs
                .option("t", {
                  alias: "trigger",
                  type: "string",
                })
                .option("r", {
                  alias: "response",
                  type: "string",
                }),
            response: async (input, meta) => {
              if (input === "help") return 'e.g. -t "trigger" -r "response"';

              await meta.store.addCommandToGuild(meta.flags.t, meta.flags.r);

              return `Added \`${meta.flags.t}\`: \`${meta.flags.r}\``;
            },
          }),
          new Command({
            trigger: "remove",
            response: async (input, meta) => {
              await meta.store.removeGuildComand(input);

              return `Removed ${input}`;
            },
          }),
          new Command({
            trigger: "list",
            response: async (_, meta) => {
              const guildCommands = await meta.store.getGuildComands();
              return (
                guildCommands
                  .map(
                    ({ trigger, response }) => `\`${trigger}\`: \`${response}\``
                  )
                  .join("\n") || "no commands to list"
              );
            },
          }),
        ],
      }),
    ],
  }),

  // new Command({
  //   trigger: "voice",
  //   useVoiceCommand: true,
  //   response: "beep boop, i dont understand",
  //   commands: [
  //     new Command({
  //       trigger: "hello robot",
  //       response: "hello human",
  //     }),
  //     new Command({
  //       trigger: "play corner",
  //       action: async (_, meta) => {
  //         await meta.voiceInstance.playFileFromBucket("corner");
  //       },
  //     }),
  //   ],
  // }),
];
