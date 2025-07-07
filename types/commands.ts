import type { ApplicationCommandOptionData, CommandInteraction, Locale, SlashCommandBuilder } from 'discord.js'

export interface CommandData {
  options?: ApplicationCommandOptionData[]
  name: string
  name_localizations?: Partial<Record<Locale, string | null>> | null
  description: string
  description_localizations?: Partial<Record<Locale, string | null>> | null
  contexts?: number[]
  default_permission?: boolean
  default_member_permissions?: string | null
  dm_permission?: boolean
  integration_types?: number[]
  nsfw?: boolean
  type?: number
}

export interface Command {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}
