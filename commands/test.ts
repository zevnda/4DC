import type { CommandInteraction } from 'discord.js'
import { MessageFlags, SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder().setName('test').setDescription('Test command')

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    await interaction.deleteReply()
  } catch (error) {
    console.error('Error executing command:', error)
  }
}
