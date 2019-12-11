export class Store {
  constructor(meta) {
    Object.assign(this, meta);
  }

  async syncGuild() {
    const members = [...this.users.filterOutBots().values()];

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
  }
}
