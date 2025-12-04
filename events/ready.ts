import type { Client } from 'discord.js'
import type { CommandData } from '../types/commands'
import { Events } from 'discord.js'

export const name = Events.ClientReady
export const once = true
export function execute(client: Client, commandsArr: CommandData[]): void {
  console.log(`Logged in as ${client.user?.tag}`)

  const guild = client.guilds.cache.get(process.env.GUILD_ID!)
  const guildSgi = client.guilds.cache.get('1445588897076871277')

  if (guild) {
    guild.commands.set(commandsArr)
    console.log(`Commands synced to guild: ${guild.name} (${guild.id})`)
  }
  if (guildSgi) {
    guildSgi.commands.set(commandsArr)
    console.log(`Commands synced to guild: ${guildSgi.name} (${guildSgi.id})`)
  }
}
