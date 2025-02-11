/* eslint-disable no-unused-vars */
import { CommandInteraction, ApplicationCommandType, MessageFlags, EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonStyle, TextInputBuilder, ModalBuilder, AttachmentBuilder, ApplicationCommandPermissionsManager, bold, ChannelSelectMenuBuilder, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits } from 'discord.js';
import { sendReply, sendResponse, dbFindOne, dbUpdateOne } from '../../../utils/utils.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import schema from '../../../schemas/rank_schema.js';

export default {
    name: 'test',
    description: 'dummy command',
    defaultMemberPermissions: ['Administrator'],
    cooldown: 0,
    dm_permission: false,
    type: ApplicationCommandType.ChatInput,
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, member, guild, channel, user } = interaction;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral }).catch(err => console.error('There was a problem deferring an interaction: ', err));
        interaction.deleteReply();
    },
};