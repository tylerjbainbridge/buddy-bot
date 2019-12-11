import _ from "lodash";
import { removeFromString } from "../utils";
import { Voice } from "./Voice";

// const command = new Command({
//   trigger: 'list|ls',
//   action: meta => {
//     // return response for the default case
//   },
//   // accept string as well
//   action: '',
//   commands: [
//     new Resolve({
//       trigger: 'add',
//       response: 'adding..',
//     })
//   ]
// });

export class Command {
  constructor({
    // string to match to- use the | delimiter for multiple matches
    trigger,

    // Optional description for the help menu.
    description,

    // You MUST supply either a response or an action.

    // Function or string indicating a message response
    response,
    // Function to run (doesnt need to return anything) - used for manual actions
    action,

    // Initialize a voice connection and respond via voice
    useVoiceCommand,

    // Sub commands for ths resolver
    commands,

    // Forced flags
    flags,
  }) {
    this.trigger = trigger;
    this.description = description;
    this.response = response;
    this.action = action;
    this.useVoiceCommand = useVoiceCommand;
    this.commands = commands;
    this.flags = flags || {};

    this.run = this.run.bind(this);
  }

  getHelp(level = 0) {
    const help =
      `${_.times(level * 2, () => "- ").join("")}\`${this.trigger}\`${
        this.description ? `: ${this.description}` : ""
      }` + "\n";

    if (this.commands && this.commands.length) {
      return this.commands.reduce((p, c) => (p += c.getHelp(level + 1)), help);
    }

    return help;
  }

  /**
   * Returns the exact match string
   */
  isMatch(input, isStrict = false) {
    const sanitized = input.toLowerCase().trim();

    let matchFunc = option => sanitized.startsWith(option);

    // Strict matching only matches on the first word.
    if (isStrict) {
      const words = sanitized.split(" ");
      const matchWord = words.shift().trim();

      matchFunc = option => matchWord === option;
    }

    return this.trigger
      .toLowerCase()
      .split("|")
      .find(matchFunc);
  }

  /**
   * Runs for each action- if it's not a match, it returns
   * @param {*} input
   * @param {*} metas
   */
  async run(input, initialMeta, { isStrict = false } = {}) {
    const match = this.isMatch(input, isStrict);
    if (!match) return false;

    const meta = {
      ...initialMeta,
      flags: {
        ...this.flags,
        // User specified strings take priority.
        ...initialMeta.flags,
      },
    };

    let nextInput = removeFromString(input, match);

    // Initialize foice
    if (
      (this.useVoiceCommand || meta.flags.talk || meta.flags.voice) &&
      !meta.voiceInstance
    ) {
      meta.voiceInstance = new Voice(meta);
      await meta.voiceInstance.connect();
    }

    // Special case
    if (nextInput === "help") {
      meta.message.channel.send(this.getHelp());
      return true;
    } else if (this.useVoiceCommand) {
      nextInput = await meta.voiceInstance.listen();
    }

    // Check if any sub commands were matches
    if (this.commands && this.commands.length) {
      for (let i = 0; i < this.commands.length; i++) {
        const command = this.commands[i];

        const subMatch = await command.run(nextInput, meta);

        // If there was a sub command match- we're done
        if (subMatch) return true;
      }
    }

    // Allow simple string action
    if (this.response) {
      const content = _.isString(this.response)
        ? this.response
        : await this.response(nextInput, meta);

      if (meta.flags.talk || meta.voiceInstance) {
        await meta.voiceInstance.talk(content);
      } else {
        meta.message.channel.send(content);
      }

      return true;
    } else if (this.action) {
      // Allow for lower level async function actions
      await this.action(nextInput, meta);

      return true;
    }

    // Nothing happenned- silently move on.
    return false;
  }
}
