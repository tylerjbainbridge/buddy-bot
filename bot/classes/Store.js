import shortid from "shortid";

export class Store {
  constructor(meta) {
    Object.assign(this, meta);
  }

  async syncGuild() {
    const members = [...this.users.filterOutBots().values()];

    this.message.channel.send("Syncing...");

    const { id: guildId, name: guildName } = this.message.guild;

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

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      let user = await this.photon.users.findOne({
        where: {
          id: member.id,
          username: member.username,
        },
      });

      if (!user) {
        user = await this.photon.users.create({
          data: {
            id: member.id,
            guild: {
              connect: {
                id: guildId,
              },
            },
          },
        });
      }
    }

    this.message.channel.send("Done");
  }

  async addCommandToGuild(trigger, response) {
    const {
      user,
      guild: { id: guildId, name: guildName },
    } = this.message.guild;

    let [command] = await this.photon.commands.findMany({
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
              id: userId,
            },
          },
          guild: {
            connect: {
              id: guildId,
            },
          },
        },
      });
    }
  }
}
