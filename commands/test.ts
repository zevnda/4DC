import type { CommandInteraction } from 'discord.js'
import { MessageFlags, SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder().setName('test').setDescription('Test command'),
  async execute(interaction: CommandInteraction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral })

      await interaction.deleteReply()
    } catch (error) {
      console.error('Error executing command:', error)
    }
  },
}
