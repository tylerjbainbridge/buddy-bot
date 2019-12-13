import { Store } from "./classes/Store";
import { sleep, getGeneralChannel } from "./utils";
import { Users } from "./classes/Users";

const reminders = async (client, photon) => {
  const store = new Store({ photon });
  const users = new Users({ client });

  // Run every 10 seconds
  while (true) {
    const reminders = await store.getPastDueReminders();

    for (let i = 0; i < reminders.length; i++) {
      const reminder = reminders[i];

      const guild = client.guilds.get(reminder.guild.id);

      const user = client.users.get(reminder.user.id);

      const channel =
        client.channels.get(reminder.channelId) || getGeneralChannel(guild);

      await store.completeReminder(reminder);

      channel.send(`(${users.getUserMention(user)}) Reminder: ${reminder.content}`);
    }

    await sleep(10000);
  }
};

export const jobs = [reminders];
