export class Users {
  constructor(meta) {
    Object.assign(this, meta);
  }

  findByUsername(username) {
    return this.message.guild.members.find(
      ({ user }) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  filterOutBots() {
    return this.message.guild.members.filter(({ user }) => !user.bot);
  }

  getUserMention(user) {
    return `<@!${user.id}>`;
  }

  getBatchUserMention() {
    return this.message.guild.members
      .map(({ user }) => this.getUserMention(user))
      .join("\n");
  }
}
