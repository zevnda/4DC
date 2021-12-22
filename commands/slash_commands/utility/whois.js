const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: `whois`,
    description: `Get detailed information about a user`,
    permission: ``,
    type: `CHAT_INPUT`,
    options: [{
        name: `username`,
        description: `The user whos information you want`,
        type: `USER`,
        required: false,
    }],
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember(`username`) || member

        let acknowledgements = 'None'
        permissions = [];

        if (target?.permissions.has("ADMINISTRATOR")) {
            permissions.push("Administrator");
            acknowledgements = 'Administrator';
        }
        if (target?.permissions.has("BAN_MEMBERS")) {
            permissions.push("Ban Members");
        }
        if (target?.permissions.has("KICK_MEMBERS")) {
            permissions.push("Kick Members");
        }
        if (target?.permissions.has("MANAGE_MESSAGES")) {
            permissions.push("Manage Messages");
            acknowledgements = 'Moderator';
        }
        if (target?.permissions.has("MANAGE_CHANNELS")) {
            permissions.push("Manage Channels");
        }
        if (target?.permissions.has("MENTION_EVERYONE")) {
            permissions.push("Mention Everyone");
        }
        if (target?.permissions.has("MANAGE_NICKNAMES")) {
            permissions.push("Manage Nicknames");
        }
        if (target?.permissions.has("MANAGE_ROLES")) {
            permissions.push("Manage Roles");
            acknowledgements = 'Administrator';
        }
        if (target?.permissions.has("DEAFEN_MEMBERS")) {
            permissions.push("Deafen Members");
            acknowledgements = 'Administrator';
        }
        if (target?.permissions.has("MANAGE_WEBHOOKS")) {
            permissions.push("Manage Webhooks");
        }
        if (target?.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            permissions.push("Manage Emojis and Stickers");
        }
        if (permissions.length == 0) {
            permissions.push("No Key Permissions Found");
        }
        if (target.id == interaction.guild.ownerId) {
            acknowledgements = 'Server Owner';
        }

        if (target.presence?.status === 'online') targetStatus = 'Online';
        if (target.presence?.status === 'idle') targetStatus = 'Idle';
        if (target.presence?.status === 'dnd') targetStatus = 'Do Not Disturb';
        if (!target.presence?.status) targetStatus = 'Offline';

        const roles = guild.members.cache.get(target.id)._roles.length;
        let roleList = `None`;
        if (roles > 0) roleList = `<@&${guild.members.cache.get(target.id)._roles.join('>, <@&')}>`;

        const response = new MessageEmbed()
            .setAuthor(`${target.user.tag}`, `${target.user.displayAvatarURL({ dynamic: true })}`)
            .setColor('RANDOM')
            .setThumbnail(`${target.user.displayAvatarURL({ dynamic: true })}`)
            .addField('Registered:', `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)
            .addField('Joined:', `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
            .addField('Status:', `${targetStatus}`, true)
            .addField('Roles:', `${roleList}`, false)
            .addField('Acknowledgements:', `${acknowledgements}`, true)
            .addField('Permissions:', `${permissions.join(`, `)}`, false)
            .setFooter(`ID: ${target.id}`)
            .setTimestamp()

        if (target.user.bot) response.addField('Additional:', `This user is a BOT`, false);

        await interaction.reply({
            embeds: [response],
            ephemeral: true
        });


        
    }
}