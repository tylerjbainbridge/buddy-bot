export class Users {
  constructor(meta) {
    Object.assign(this, meta);
  }

  get users() {
    return this.message ? this.message.guild.members : this.client.users;
  }

  findByUsername(username) {
    return this.users.find(
      ({ user }) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  filterOutBots() {
    return this.users.filter(({ user }) => !user.bot);
  }

  getUserMention(user) {
    return `<@!${user.id}>`;
  }

  getBatchUserMention() {
    return this.users.map(({ user }) => this.getUserMention(user)).join("\n");
  }
}
