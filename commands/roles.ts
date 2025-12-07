import type { ChatInputCommandInteraction } from 'discord.js'
import { GuildMember, MessageFlags, SlashCommandBuilder, userMention } from 'discord.js'

export const data = new SlashCommandBuilder()
  .setName('roles')
  .setDescription('Add or remove roles from yourself')
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Add a role to yourself')
      .addStringOption(option =>
        option
          .setName('role')
          .setDescription('The role to add')
          .setRequired(true)
          .addChoices(
            { name: 'Announcements (get notified about new announcements)', value: '1447060276515049572' },
            { name: 'Changelogs (get notified about new changelogs)', value: '1447060344056053841' },
          ),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Remove a role from yourself')
      .addStringOption(option =>
        option
          .setName('role')
          .setDescription('The role to remove')
          .setRequired(true)
          .addChoices(
            { name: 'Announcements', value: '1447060276515049572' },
            { name: 'Changelogs', value: '1447060344056053841' },
          ),
      ),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const subcommand = interaction.options.getSubcommand()
    const roleId = interaction.options.getString('role', true)
    const member = interaction.member

    if (!member || !(member instanceof GuildMember)) {
      await interaction.editReply('Could not find your member information.')
      return
    }

    const role = interaction.guild?.roles.cache.get(roleId)
    if (!role) {
      await interaction.editReply('Could not find the specified role.')
      return
    }

    if (subcommand === 'add') {
      if (member.roles.cache.has(roleId)) {
        await interaction.editReply(`You already have the ${role} role.`)
        return
      }

      await member.roles.add(roleId)
      await interaction.editReply(`Successfully added the ${role} role to ${userMention(member.user.id)}.`)
    } else if (subcommand === 'remove') {
      if (!member.roles.cache.has(roleId)) {
        await interaction.editReply(`You don't have the ${role} role.`)
        return
      }

      await member.roles.remove(roleId)
      await interaction.editReply(`Successfully removed the ${role} role from ${userMention(member.user.id)}.`)
    }
  } catch (error) {
    console.error('Error executing command:', error)
    await interaction.editReply('There was an unexpected error. Please try again later.')
  }
}
