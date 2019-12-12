import { Store } from "./classes/Store";
import { sleep, getGeneralChannel } from "./utils";

const reminders = async (client, photon) => {
  const store = new Store({ photon });

  // Run every 10 seconds
  while (true) {
    const reminders = await store.getPastDueReminders();

    console.log(reminders);

    for (let i = 0; i < reminders.length; i++) {
      const reminder = reminders[i];

      const guild = client.guilds.get(reminder.guild.id);

      const channel = getGeneralChannel(guild);

      await store.completeReminder(reminder);

    //   const messages = await message.channel.fetchMessages({around: reminder.messageId, limit: 1});

    //   const fetchedMsg = messages.first();

      channel.send(`Reminder: ${reminder.content}`);
    }

    await sleep(10000);
  }
  
};

export const jobs = [reminders]
