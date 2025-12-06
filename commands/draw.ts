import type { ChatInputCommandInteraction } from 'discord.js'
import { bold, SlashCommandBuilder, userMention } from 'discord.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_ANON_KEY ?? '')

export const data = new SlashCommandBuilder()
  .setName('draw-giveaway')
  .setDescription('Draw a random giveaway winner')
  .addBooleanOption(option =>
    option.setName('clear-entries').setDescription('Clear all entries after drawing').setRequired(false),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply()

    const clearEntries = interaction.options.getBoolean('clear-entries') ?? false

    const { data, error } = (await supabase.from('giveaway').select('uid')) as {
      data: { uid: string }[] | null
      error: Error | null
    }

    if (error) {
      console.error('Error fetching giveaway entries:', error)
      await interaction.editReply('There was an error drawing a winner.')
      return
    }

    if (!data || data.length === 0) {
      await interaction.editReply('There are no entries in the giveaway yet!')
      return
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    const winner = data[randomIndex]

    if (clearEntries) {
      const { error: deleteError } = await supabase.from('giveaway').delete().neq('uid', '')

      if (deleteError) {
        console.error('Error clearing giveaway entries:', deleteError)
        return
      }
    }

    await interaction.editReply(
      `🎊 ${bold('CONGRATULATIONS!')} 🎊\n\n${userMention(winner.uid)} has won the giveaway! 🏆\n\nOut of ${bold(`${data.length} entries`)}, you were chosen!\n\nPlease contact ${userMention('438434841617367080')} to claim your prize! 🎁`,
    )
  } catch (error) {
    console.error('Error executing command:', error)
    await interaction.editReply('There was an unexpected error. Please try again later.')
  }
}
