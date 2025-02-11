// eslint-disable-next-line no-unused-vars
import { CommandInteraction, ApplicationCommandType, EmbedBuilder, MessageFlags } from 'discord.js';
import { sendResponse } from '../../../utils/utils.js';

export default {
    name: 'Avatar',
    cooldown: 5,
    dm_permission: false,
    type: ApplicationCommandType.User,
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const { guild } = interaction;
        const target = await guild.members.fetch(interaction.targetId).catch(err => console.error('There was a problem fetching a guild member: ', err));

        await interaction.deferReply({ flags: MessageFlags.Ephemeral }).catch(err => console.error('There was a problem deferring an interaction: ', err));

        // If the target doesn't exist
        if (!target) return sendResponse(interaction, 'This user no longer exists');

        const response = new EmbedBuilder()
            .setColor('#32BEA6')
            .setAuthor({ name: `${target?.user.username}`, iconURL: target?.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('AVATAR')
            .setImage(`${target.user.displayAvatarURL({ dynamic: true })}?size=256`);

        sendResponse(interaction, '', [response]);
    },
};
