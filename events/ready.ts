import type { CommandData } from '@/types/commands'
import type { Client } from 'discord.js'
import { Events } from 'discord.js'

export const name = Events.ClientReady
export const once = true
export function execute(client: Client, commandsArr: CommandData[]): void {
  console.log(`Logged in as ${client.user?.tag}`)

  const guild = client.guilds.cache.get(process.env.GUILD_ID!)
  if (guild) {
    guild.commands.set(commandsArr)
    console.log(`Commands synced to guild: ${guild.name} (${guild.id})`)
  }
}
