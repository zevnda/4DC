import type { CommandInteraction } from 'discord.js'
import { Events, MessageFlags } from 'discord.js'

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      console.log(
        `Command executed: ${interaction.commandName}\nUser: ${interaction.user.tag} (${interaction.user.id})\nGuild: ${interaction.guild?.name} (${interaction.guild?.id})`,
      )
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        })
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        })
      }
    }
  },
}
