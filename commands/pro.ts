import type { ChatInputCommandInteraction } from 'discord.js'
import { MessageFlags, SlashCommandBuilder, userMention } from 'discord.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_ANON_KEY ?? '')

export const data = new SlashCommandBuilder()
  .setName('claim-pro-role')
  .setDescription('Claim Pro Role')
  .addStringOption(option => option.setName('steamid').setDescription('Your Steam ID').setRequired(true))

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const steamid = interaction.options.getString('steamid', true)

    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, discord_role_claimed_by')
      .eq('steam_id', steamid)
      .in('status', ['active'])
      .maybeSingle()

    if (error) {
      console.error('Error checking subscription:', error)
      await interaction.editReply(
        `There was an error checking your subscription. Please contact ${userMention('438434841617367080')} for assistance.`,
      )
      return
    }

    if (data && data.discord_role_claimed_by !== null) {
      await interaction.editReply(
        `This Pro subscription has already been claimed. If you believe this is an error, please contact ${userMention('438434841617367080')} for assistance.`,
      )
      return
    }

    if (data) {
      // Update the users role
      const guild = interaction.guild
      if (!guild) {
        await interaction.editReply('This command can only be used in a server.')
        return
      }

      // Fetch the member
      const member = await guild.members.fetch(interaction.user.id)

      // Add the Pro role
      await member.roles.add('1445590102381301830')

      // Mark the subscription as claimed in the database
      await supabase
        .from('subscriptions')
        .update({ discord_role_claimed_by: interaction.user.id })
        .eq('steam_id', steamid)

      await interaction.editReply('Success! Your Pro subscription has been redeemed.')
      return
    }

    await interaction.editReply(
      `No active Pro subscription found for Steam ID: ${steamid}. Please ensure you have an active subscription. If you believe this is an error, contact ${userMention('438434841617367080')} for assistance.`,
    )
  } catch (error) {
    console.error('Error executing command:', error)
  }
}
