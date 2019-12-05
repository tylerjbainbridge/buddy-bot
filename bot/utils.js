import axios from "axios";
import lame from "lame";

import { reddit } from "./config";

export const findByUsername = (users, username) =>
  users.find(user => user.username === username);

export const filterOutBots = users => users.filter(({ bot }) => !bot);

export const mention = user => `<@!${user.id}>`;

export const mentionUsernames = users =>
  users.map(user => `${mention(user)}\n`);

export const test = (trigger, content) =>
  new RegExp(`\\b${trigger}\\b`, "i").test(content);

export const removeFromString = (string, toRemove) =>
  string.replace(new RegExp(toRemove, "i"), "").trim();

export const getResolver = (resolvers, command) => {
  const resolverKeys = Object.keys(resolvers);

  for (let i = 0; i < resolverKeys.length; i++) {
    const base = resolverKeys[i];
    const exact = base.split("|").find(subKey => command.startsWith(subKey));

    if (exact) {
      const sub = removeFromString(command, exact);
      console.log("match", { exact, sub });
      return { base, exact, sub };
    }
  }

  return null;
};

export const getMessageFromResolver = async (resolvers, match, config) =>
  await resolvers[match.base](match.sub, config);

export const postToJamieReddit = async title => {
  try {
    const submission = await reddit
      .getSubreddit("thingsjamiehassaid")
      .submitSelfpost({ title });

    return submission.url;
  } catch (e) {
    return e.message || "Something went wrong";
  }
};

export const playStreamFromUrl = (voiceChannel, url) =>
  new Promise(async (resolve, reject) => {
    const connection = await voiceChannel.join().catch(err => console.log(err));

    const { data } = await axios.get(url, {
      responseType: "stream",
      headers: { "Content-Type": "audio/mpeg3" },
    });

    const decoder = new lame.Decoder();

    data.pipe(decoder);

    const dispatcher = connection.playConvertedStream(data);

    dispatcher.on("end", resolve);
    dispatcher.on("error", reject);
  });
