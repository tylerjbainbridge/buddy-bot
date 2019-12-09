import axios from "axios";
import { promisify } from "util";
import fs from "fs";
import _ from "lodash";

const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

import { polly, speechToText, POLLY_VOICES } from "../config";
import { getBotChannel } from "../utils";

export class Voice {
  constructor(meta) {
    // Include meta
    Object.assign(this, meta);

    this.connection = null;
    this.voiceChannel = null;
  }

  async connect(channel) {
    this.voiceChannel = channel || this.message.member.voice.channel;

    if (!this.voiceChannel) {
      this.message.channel.send(`Join a voice channel and try again`);
      throw "User not in voice channel";
    }

    this.connection = await this.voiceChannel.join();
  }

  leave() {
    this.voiceChannel.leave();
    this.voiceChannel = null;
    this.connection = null;
  }

  async talk(text) {
    return new Promise(async (resolve, reject) => {
      if (this.flags.silent) return resolve();

      getBotChannel(this.client).send(`Saying: ${text}`);

      const data = await polly
        .synthesizeSpeech({
          Text: text,
          OutputFormat: "mp3",
          VoiceId: this.flags.pollyVoice || POLLY_VOICES[0], // default = Joanna
        })
        .promise();

      const id =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);

      const filename = `./${id}.mp3`;

      await writeFileAsync(filename, data.AudioStream);

      const dispatchers = this.connection.play(filename);

      dispatchers.on("end", async () => {
        await unlinkAsync(filename);
        resolve();
      });

      dispatchers.on("error", reject);
    });
  }

  async listen() {
    return new Promise(async (resolve, reject) => {
      console.log('bot', this.users.findByUsername('buddy-bot'));

      // 16-bit signed PCM, stereo 48KHz stream
      const pcmStream = this.connection.receiver.createStream(
        this.flags.voiceTest ? this.users.findByUsername('buddy-bot') : this.message.author,
        {
          mode: "pcm",
          end: "silence",
        }
      );

      // pcmStream.pipe(fs.createWriteStream(__dirname + `/${Date.now()}.pcm`));

      // create the stream
      const recognizeStream = speechToText.recognizeUsingWebSocket({
        model: "en-US_BroadbandModel",
        contentType: "audio/l16;rate=48000;channels=2",
        interimResults: true,
        inactivityTimeout: -1,
      });

      await this.talk(`I'm Listening...`);
      await this.playFileFromBucket("beep");

      pcmStream.pipe(recognizeStream);

      this.message.channel.send("Listening...");


      if (this.flags.voiceTest) {
        await this.talk(this.flags.voiceTest);
      }

      const throttledLog = _.throttle(() => {
        getBotChannel(this.client).send(
          `${this.message.author.username} is speaking...`
        );
      }, 1000);

      pcmStream.on("data", throttledLog);

      pcmStream.on("error", () => {
        console.log("uh oh!");
      });

      pcmStream.on("close", () => {
        getBotChannel(this.client).send(
          `${this.message.author.username} is DONE speaking.`
        );
      });

      // Backup timeout.
      // setTimeout(() => {
      //   pcmStream.destroy();
      // }, 5000);

      // // pipe in some audio
      // fs.createReadStream(__dirname + '/test.wav').pipe(recognizeStream);

      recognizeStream.on("data", event => {
        const text = event.toString();

        onEvent("Data:", text);

        getBotChannel(this.client).send(
          `I heard ${this.message.author.username} say: ${text}`
        );

        // Cleanup
        pcmStream.destroy();

        // Resolve promise with the detected text
        resolve(text.trim());
      });

      recognizeStream.on("error", event => {
        onEvent("Error:", event);
        getBotChannel(this.client).send("Error processing audio.");
        reject();
      });

      recognizeStream.on("close", event => {
        onEvent("Close:", event);
        getBotChannel(this.client).send("Watson exit.");
      });

      // Displays events on the console.
      function onEvent(name, event) {
        console.log(name, JSON.stringify(event, null, 2));
      }
    });
  }

  async playStreamFromUrl(url) {
    return new Promise(async (resolve, reject) => {
      const { data: stream } = await axios.get(url, {
        responseType: "stream",
        headers: { "content-type": "audio/mpeg", accept: "audio/mpeg" },
      });

      const dispatcher = this.connection.play(stream);

      dispatcher.on("end", resolve);
      dispatcher.on("error", reject);
    });
  }

  async playFileFromBucket(fileName) {
    await this.playStreamFromUrl(
      `https://v-buddy-bot.s3.amazonaws.com/${fileName}.mp3`
    );
  }
}
