// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageFlags, PermissionFlagsBits } from 'discord.js';
import adInformationButton from '../../handlers/buttons/ad_information.js';

const cooldowns = new Map();

export default {
    name: 'interactionCreate',
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client, Discord) {
        const { member } = interaction;

        // Get the interaction by name
        const command = client.commands.get(interaction.commandName);

        // Slash command handler
        if (interaction.isChatInputCommand()) {
            // Handle cooldown for individual commands
            if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
            const currentTime = Date.now();
            const cooldownUsers = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown) * 1000;
            // Ignore user's with the administrator role for command cooldowns
            if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
                // If the user is on cooldown for the specific command, notify them
                if (cooldownUsers.has(member.id)) {
                    const expirationTime = cooldownUsers.get(member.id) + cooldownAmount;
                    // Calculate the time left on the user's cooldown in seconds
                    const timeLeft = (expirationTime - currentTime) / 1000;
                    // If the user's cooldown has not yet expired
                    if (currentTime < expirationTime) {
                        const cooldownMessage = timeLeft > 60 ?
                            `${Math.round(timeLeft / 60)} minutes` :
                            `${Math.round(timeLeft)} seconds`;
                        // Notify the user
                        return interaction.reply({
                            content: `Cooldown: ${cooldownMessage}`,
                            flags: MessageFlags.Ephemeral,
                        });
                    }
                }
                // Add the user and current time to the cooldown
                cooldownUsers.set(member.id, currentTime);
                // Remove the user from the cooldown after a period of time
                setTimeout(() => cooldownUsers.delete(member.id), cooldownAmount);
            }
            // If no command with the specified command name was found
            if (!command) {
                interaction.reply({
                    content: 'Could not run this command',
                    flags: MessageFlags.Ephemeral,
                }).catch(err => console.error('There was a problem sending an interaction: ', err));
                return client.command.module(interaction.commandName);
            }
            // Execure the command and log it's usage
            command.execute(interaction, client);
            console.log('\x1b[36m%s\x1b[0m', `${interaction.member.displayName}`, `used /${command.name}`);
        }

        // Context menu command handler
        if (interaction.isContextMenuCommand()) {
            // Handle cooldown for individual commands
            if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
            const currentTime = Date.now();
            const cooldownUsers = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown) * 1000;
            // Ignore user's with the administrator role for command cooldowns
            if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
                // If the user is on cooldown for the specific command, notify them
                if (cooldownUsers.has(member.id)) {
                    const expirationTime = cooldownUsers.get(member.id) + cooldownAmount;
                    // Calculate the time left on the user's cooldown in seconds
                    const timeLeft = (expirationTime - currentTime) / 1000;
                    // If the user's cooldown has not yet expired
                    if (currentTime < expirationTime) {
                        const cooldownMessage = timeLeft > 60 ?
                            `${Math.round(timeLeft / 60)} minutes` :
                            `${Math.round(timeLeft)} seconds`;
                        // Notify the user
                        return interaction.reply({
                            content: `Cooldown: ${cooldownMessage}`,
                            flags: MessageFlags.Ephemeral,
                        });
                    }
                }
                // Add the user and current time to the cooldown
                cooldownUsers.set(member.id, currentTime);
                // Remove the user from the cooldown after a period of time
                setTimeout(() => cooldownUsers.delete(member.id), cooldownAmount);
            }
            // Execure the command and log it's usage
            command.execute(interaction, client);
            console.log('\x1b[36m%s\x1b[0m', `${interaction.member.displayName}`, `used /${command.name}`);
        }

        // Button submit handler
        if (interaction.isButton()) {
            // Get the customId of the button
            const customId = interaction.customId;
            const customIdPrefix = interaction.customId.split('-')[0];
            // A map of customIds for the buttons with prefixed custom IDs
            const prefixedButtons = {
            };
            if (customIdPrefix in prefixedButtons) prefixedButtons[customIdPrefix](interaction);

            // A map of customIds for misc buttons
            const miscButtons = {
                'ad-info': adInformationButton,
            };
            if (customId in miscButtons) miscButtons[customId](interaction);
        }
    },
};