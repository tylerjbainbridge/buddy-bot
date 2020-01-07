import shortid from "shortid";
import chrono from "chrono-node";
import moment from "moment-timezone";

import { Command } from "./Command";
import { removeFromString } from "../utils";

export class Store {
  constructor(meta) {
    Object.assign(this, meta || {});
  }

  async checkIfUserExistsAndCreateIfNot({ id, username }, { id: guildId }) {
    let user = await this.photon.users.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      user = await this.photon.users.create({
        data: {
          id,
          username,
          guild: {
            connect: {
              id: guildId,
            },
          },
        },
      });
    }

    return user;
  }

  async checkIfGuildExistsAndCreateIfNot({ id: guildId, name: guildName }) {
    let guild = await this.photon.guilds.findOne({
      where: {
        id: guildId,
      },
    });

    if (!guild) {
      guild = await this.photon.guilds.create({
        data: {
          id: guildId,
          name: guildName,
        },
      });
    }

    return guild;
  }

  async getPastDueReminders() {
    return await this.photon.reminders.findMany({
      where: {
        isDone: false,
        remindAt: {
          lt: new Date(),
        },
      },
      include: { guild: true, user: true },
    });
  }

  async completeReminder(reminder) {
    return await this.photon.reminders.update({
      where: {
        id: reminder.id,
      },
      data: {
        isDone: true,
      },
    });
  }

  async addReminder(input, meta) {
    await this.checkIfGuildExistsAndCreateIfNot(this.message.guild);
    await this.checkIfUserExistsAndCreateIfNot(
      this.message.author,
      this.message.guild
    );

    const offset = moment()
      .tz("America/New_York")
      .utcOffset();

    const parsed = chrono.parse(input, new Date(), { =IST: offset } );

    const startDate = parsed[0].start;

    startDate.assign("timezoneOffset", offset);

    const relativeDateStr = moment(startDate.date())
      .tz("America/New_York")
      .calendar();

    const content = removeFromString(input, parsed[0].text);

    await this.photon.reminders.create({
      data: {
        id: shortid(),
        content,
        messageId: meta.message.id,
        channelId: meta.message.channel.id,
        remindAt: new Date(
          moment(startDate.date())
            .utc()
            .format()
        ),
        isDone: false,
        guild: {
          connect: {
            id: this.message.guild.id,
          },
        },
        user: {
          connect: {
            id: this.message.author.id,
          },
        },
      },
    });

    return { relativeDateStr, content };
  }

  async syncGuild() {
    const members = [...this.users.filterOutBots().values()];

    this.message.channel.send("Syncing...");

    await this.checkIfGuildExistsAndCreateIfNot(this.message.guild);

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      await this.checkIfUserExistsAndCreateIfNot(member.user, this.message.guild);
    }

    this.message.channel.send("Done");
  }

  async addCommandToGuild(trigger, response) {
    const { author, guild } = this.message;

    await this.checkIfUserExistsAndCreateIfNot(author, guild);

    let [command] = await this.photon.guilds
      .findOne({ where: { id: guild.id } })
      .commands({
        where: {
          trigger,
        },
      });

    if (!command) {
      command = await this.photon.commands.create({
        data: {
          id: shortid(),
          response,
          trigger,
          user: {
            connect: {
              id: author.id,
            },
          },
          guild: {
            connect: {
              id: guild.id,
            },
          },
        },
      });
    }

    return command;
  }

  async removeGuildComand(trigger) {
    const {
      guild: { id: guildId },
    } = this.message;

    await this.photon.guilds.update({
      where: { id: guildId },
      data: {
        commands: {
          deleteMany: {
            trigger,
          },
        },
      },
    });
  }

  async getGuildComands() {
    const {
      guild: { id: guildId },
    } = this.message;

    const commands = await this.photon.guilds
      .findOne({ where: { id: guildId } })
      .commands();

    return (commands || []).map(
      ({ trigger, response }) => new Command({ trigger, response })
    );
  }
}
