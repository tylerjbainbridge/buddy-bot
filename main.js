require("dotenv").config();

import Discord from "discord.js";
import axios from "axios";
import moment from "moment-timezone";

import { sleep, getBotChannel } from "./bot/utils";
import { handler } from "./bot/handler";
import { photon } from "./bot/config";
import { Store } from "./bot/classes/Store";
import { runJobs } from "./bot/jobs";

const FIFTEEN_MINUTES = 900000;

process.on("unhandledRejection", reason => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
});

export const client = new Discord.Client();

if (process.env.DYNO) {
  (async () => {
    while (true) {
      // Ping the heroku app every fifteen minutes to keep it from sleeping
      await sleep(FIFTEEN_MINUTES);
      await axios.get("https://v-buddy-bot.herokuapp.com");
    }
  })();
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}.`);
  
  if (process.env.DYNO) {
    const channel = getBotChannel(client);
    
    const date = moment()
    .tz("America/New_York")
    .format("M/D/YYYY, h:mm:ss a");
    
    channel.send(`beep boop BuddyBot updated (${date})`);
    
    // Log when the script is shutting down.
    process.on("SIGTERM", function() {
      channel.send(`BuddyBot offline (updating)`);
    });
  }

  await runJobs(client, photon);
});

client.on("message", handler(client, photon));

client.on("error", console.error);

client.login(process.env.TOKEN);

require("http")
  .createServer((_, response) => {
    response.end("Hello :)");
  })
  .listen(process.env.PORT || 3000);
