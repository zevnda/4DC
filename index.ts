import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import dotenv from 'dotenv'
import type { Command, CommandData } from '@/types/commands'
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js'

dotenv.config()

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
})

client.commands = new Collection()
const commandsArr: CommandData[] = []

async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands')
  const commandFiles = (await fs.promises.readdir(commandsPath)).filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = await import(pathToFileURL(filePath).href)
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
      commandsArr.push(command.data.toJSON())
    } else {
      console.log(`Command missing "data" or "execute" property: ${filePath}`)
    }
  }
}

async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events')
  const eventFiles = (await fs.promises.readdir(eventsPath)).filter(file => file.endsWith('.js'))

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = await import(pathToFileURL(filePath).href)
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, commandsArr))
    } else {
      client.on(event.name, (...args) => event.execute(...args, commandsArr))
    }
  }
}

async function initialize() {
  await loadCommands()
  await loadEvents()
  await client.login(process.env.TOKEN)
}

initialize().catch(console.error)
