export default {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (oldMessage?.author?.bot) return;

        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const logChan = guild.channels.cache.get(process.env.MSGLOG_CHAN);

        newMessage.forward(logChan).catch(err => console.error('There was a problem forwarding a message: ', err));
    },
};