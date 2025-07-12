import type { Message } from 'discord.js'
import { Events } from 'discord.js'
import { handleAntiSpam } from '../modules/anti-spam'
import { handleLinkModeration } from '../modules/link-moderation'

export const name = Events.MessageCreate
export async function execute(message: Message) {
  await handleAntiSpam(message)
  await handleLinkModeration(message)
}
