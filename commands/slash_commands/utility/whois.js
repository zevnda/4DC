const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse } = require('../../../utils/utils');
const path = require('path');

module.exports = {
    name: `whois`,
    description: `Get detailed information about a user`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: `username`,
        description: `The user whos information you want`,
        type: ApplicationCommandOptionType.User,
        required: false,
    }],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { member, options } = interaction;

        await interaction.deferReply({ ephemeral: true }).catch(err => console.error(`${path.basename(__filename)} There was a problem deferring an interaction: `, err));

        const target = options.getMember(`username`) || member
        // Filter the target's permissions in an array
        const permissions = target.permissions.toArray();
        const sortedPermissionsArray = permissions.sort();
        const formattedPermissions = sortedPermissionsArray.join(', ');
        const acknowledgements = permissions.includes('Administrator') ? 'Server Owner' : 'None' || permissions.includes('Administrator') ? 'Administrator' : 'None';
        // Trim the acknowledgements if they exceed the character limit
        if (acknowledgements && acknowledgements.length > 1024) acknowledgements.slice(0, 10);
        if (formattedPermissions && formattedPermissions.length > 1024) formattedPermissions.slice(0, 10);
        // If the target has no permissions
        if (formattedPermissions.length == 0) permissions.push("No Key Permissions Found");
        // Get the targets current presence
        if (target?.presence?.status === 'online') targetStatus = 'Online';
        if (target?.presence?.status === 'idle') targetStatus = 'Idle';
        if (target?.presence?.status === 'dnd') targetStatus = 'Do Not Disturb';
        if (!target?.presence?.status || target?.presence?.status === 'undefined') targetStatus = 'Offline';
        // Create a response embed
        const response = new EmbedBuilder()
            .setAuthor({ name: `${target?.user.tag}`, iconURL: target?.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(`${target?.user.displayAvatarURL({ dynamic: true })}`)
            .addFields(
                { name: `Registered`, value: `<t:${parseInt(target?.user.createdTimestamp / 1000)}> \n*(<t:${parseInt(target?.user.createdTimestamp / 1000)}:R>)*`, inline: true },
                { name: `Joined`, value: `<t:${parseInt(target?.joinedTimestamp / 1000)}> \n*(<t:${parseInt(target?.joinedTimestamp / 1000)}:R>)*`, inline: true },
                { name: `Status`, value: `${targetStatus}`, inline: false },
                { name: `Acknowledgements`, value: `${acknowledgements}`, inline: false },
                { name: `Permissions`, value: `${formattedPermissions}`, inline: false })
            .setFooter({ text: target?.id })
            .setTimestamp()

        // If the target user is a bot, add an additional field to the embed
        if (target?.user.bot) response.addFields({ name: 'Additional:', value: `This user is a BOT`, inline: false });

        sendResponse(interaction, ``, [response]);
    }
}