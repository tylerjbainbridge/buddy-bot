import axios from "axios";
import _ from "lodash";
import {
  mentionUsernames,
  filterOutBots,
  findByUsername,
  mention,
  removeFromString
} from "./utils";

const weatherAppID = "70da43007f50c4366fbb4685ffe5ef67";
const BUDS_WITHOUT_COD = ["jam"];

export const resolvers = {
  "hello|hi": (_, { msg }) =>
    `hey ${msg.author.username || ""}! im your bot bud`,
  help: () => `heh just kidding, you gotta find em yourself :)`,
  "beep boop": () => `i am a robot`,
  "things jamie has said|thingsjamiehassaid|tjhs": async () => {
    const { data } = await axios.get(
      "http://api.reddit.com/r/thingsjamiehassaid"
    );

    const { children } = data.data;

    const index = Math.floor(Math.random() * children.length);

    return children[index].data.title;
  },
  gif: async command => {
    const {
      data: {
        data: { image_url: gif }
      }
    } = await axios.get(
      `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${command}`
    );

    if (!gif) return "no gif found :(";

    return gif;
  },
  "kegparty|give me a beer|random beer|beer": async () => {
    const { data } = await axios.get(
      "http://kegparty.herokuapp.com/api/random"
    );

    const {
      link,
      name,
      style: { name: styleName, description }
    } = data;

    return `Courtesy of Key Party\n\n\nName: ${name}\n\n\nStyle: ${styleName}\n\n\nDescription: ${description}\n\n\nMore info: ${link}`;
  },
  "weather in": async command => {
    const { data: weatherData } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?appid=${weatherAppID}&q=${command}`
    );

    if (!weatherData) return "no weather found :(";

    return weatherData.weather.pop().description;
  },
  "fun fact|funfact": async () => {
    const { data } = await axios.get("http://numbersapi.com/random");

    return data;
  },
  "tj|thomas": () => _.sample(["dj*", "terry*", "tom*"]),
  "home|house|github|gh|The Hub": () => `it's public ;)`,
  sucks: () => "no you do :smile:",
  "did you love it did you hate it": () => "what would you rate it?",
  "you're the best, you're the best": () => "what should _I_ review next?",
  "tell jam to buy cod|you know what to do": (_, client) => {
    const jam = findByUsername(client.users, "jam");

    return `${mention(jam)}, buy cod!`;
  },
  sandbox: () =>
    "https://codesandbox.io/s/tylerjbainbridgebuddy-bot-sz34v?fontsize=14&hidenavigation=1&theme=dark",
  cod: (command, { client }) => {
    const users = filterOutBots(client.users).filter(
      ({ username }) => !BUDS_WITHOUT_COD.includes(username)
    );

    const jam = findByUsername(client.users, "jam");

    return `let's play cod ${command || "now"}\n${mentionUsernames(
      users
    )}\n${mention(jam)} pls play with us :(`;
  },
  "boy din": (_, { client }) => {
    const buds = filterOutBots(client.users);
    return `boy din?\n${mentionUsernames(buds)}`;
  }
};
