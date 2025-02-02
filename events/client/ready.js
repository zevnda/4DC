import { ActivityType } from 'discord.js';
import mutesCheck from '../../modules/moderation/expired_mutes.js';
import databaseCleanup from '../../modules/automation/cronjobs.js';
import mongoose from 'mongoose';

export default {
    name: 'ready',
    once: true,
    async execute(message, client, Discord) {
        console.log('Client is online!');
        console.timeEnd('Time to online');

        const guild = client.guilds.cache.get(process.env.GUILD_ID);

        // Connect to database
        mongoose.set('strictQuery', true); // Remove dep warning
        mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => console.error('There was a problem connecting to the database: ', err))
            .then(() => console.log('Connected to database'));

        // Set client activity
        client.user.setActivity({ type: ActivityType.Custom, name: 'custom', state: `Moderating ${new Intl.NumberFormat().format(guild.memberCount)} users` });
        setInterval(() => {
            client.user.setActivity({ type: ActivityType.Custom, name: 'custom', state: `Moderating ${new Intl.NumberFormat().format(guild.memberCount)} users` });
        }, 900000);

        // Misc intervals
        mutesCheck(message, client, Discord);
        databaseCleanup(client);
    },
};