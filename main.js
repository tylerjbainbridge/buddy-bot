import Discord from "discord.js";
import axios from "axios";
import moment from "moment-timezone";

import { handler } from "./bot/handler";

const FIFTEEN_MINUTES = 900000;

// Test
// roomioBotHandler({
//   content: 'roomiobot hi',
//   // Mocked discord API.
//   channel: {
//     send: console.log
//   },
//   author: {
//     username: 'Bob'
//   }
// });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  while (true) {
    // Ping the heroku app every fifteen minutes to keep it from sleeping
    await sleep(FIFTEEN_MINUTES);
    await axios.get("https://v-buddy-bot.herokuapp.com");
  }
})();

const BOT_TEST_CHANNEL_ID = "649013668373200929";

if (process.env.NODE_ENV === "production") {
  const client = new Discord.Client();

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}.`);

    if (process.env.DYNO) {
      const channel = client.channels.get(BOT_TEST_CHANNEL_ID);
      const date = moment()
        .tz("America/New_York")
        .format("M/D/YYYY, h:mm:ss a");

      channel.sendMessage(`beep boop RoomioBot updated (${date})`);
    }
  });

  client.on("message", handler);

  client.login(process.env.TOKEN);

  process.on("unhandledRejection", reason => {
    console.log("Unhandled Rejection at:", reason.stack || reason);
  });
}

require("http")
  .createServer((_, response) => {
    response.end("Hello :)");
  })
  .listen(process.env.PORT || 3000);
