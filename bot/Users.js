export class Users {
  constructor(meta) {
    Object.assign(this, meta);
  }

  findByUsername(username) {
    return this.client.users.find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  filterOutBots() {
    return this.client.users.filter(({ bot }) => !bot);
  }

  getUserMention(user) {
    return `<@!${user.id}>`;
  }

  getBatchUserMention() {
    return this.client.users.map(user => `${this.getUserMentionSring(user)}\n`);
  }
}
