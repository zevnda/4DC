import type { CommandData } from '@/types/commands'
import type { Client } from 'discord.js'
import { Events } from 'discord.js'

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client, commandsArr: CommandData[]): void {
    console.log(`Logged in as ${client.user?.tag}`)

    const guild = client.guilds.cache.get(process.env.GUILD_ID!)
    if (guild) {
      guild.commands.set(commandsArr)
      console.log(`Commands synced to guild: ${guild.name} (${guild.id})`)
    }
  },
}
