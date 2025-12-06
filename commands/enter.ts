import type { ChatInputCommandInteraction } from 'discord.js'
import { bold, SlashCommandBuilder, userMention } from 'discord.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_ANON_KEY ?? '')

export const data = new SlashCommandBuilder().setName('enter-giveaway').setDescription('Enter Giveaway')

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply()

    const { data, error } = (await supabase
      .from('giveaway')
      .upsert({
        uid: interaction.user.id,
      })
      .select()) as { data: { uid: string }[] | null; error: Error | null }

    console.log(data, error)

    if (error) {
      if (error.message.includes('duplicate key value') && error.message.includes('giveaway_uid_key')) {
        await interaction.editReply(
          `You have already entered the giveaway, ${userMention(interaction.user.id)}! Best of luck! 🍀`,
        )
        return
      }

      console.error('Error entering giveaway:', error)
      await interaction.editReply(
        `There was an error entering the giveaway. Please contact ${userMention('438434841617367080')} for assistance.`,
      )
      return
    }

    if (data) {
      await interaction.editReply(
        `🎉 ${userMention(interaction.user.id)} has been entered into the giveaway! \n\nThere are now ${bold(`${data.length} entries`)}. \nJoin the giveaway with the </enter-giveaway:1446720629041790986> command. \n\nGood luck! 🍀`,
      )
      return
    }

    await interaction.editReply('There was an unexpected error. Please try again later.')
  } catch (error) {
    console.error('Error executing command:', error)
    await interaction.editReply('There was an unexpected error. Please try again later.')
  }
}
