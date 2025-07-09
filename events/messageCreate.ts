import type { Message } from 'discord.js'
import { Events } from 'discord.js'

const userMessages = new Map<string, Array<{ content: string; timestamp: number; messageId: string }>>()

const SPAM_THRESHOLD = 3
const TIME_WINDOW = 10000
const MUTE_DURATION = 15 * 60 * 1000

export const name = Events.MessageCreate
export async function execute(message: Message) {
  if (message.author.bot) return
  if (!message.guild) return
  if (message.author.id === '438434841617367080') return

  const userId = message.author.id
  const messageContent = message.content.toLowerCase().trim()
  const currentTime = Date.now()

  if (!userMessages.has(userId)) {
    userMessages.set(userId, [])
  }

  const userHistory = userMessages.get(userId)!

  const recentMessages = userHistory.filter(msg => currentTime - msg.timestamp <= TIME_WINDOW)

  recentMessages.push({ content: messageContent, timestamp: currentTime, messageId: message.id })
  userMessages.set(userId, recentMessages)

  const duplicateMessages = recentMessages.filter(msg => msg.content === messageContent)
  const duplicateCount = duplicateMessages.length

  if (duplicateCount >= SPAM_THRESHOLD) {
    try {
      const member = message.guild.members.cache.get(userId)
      if (!member) return

      await member.timeout(MUTE_DURATION, 'Anti-spam: Sending duplicate messages')

      try {
        const messageIds = duplicateMessages.map(msg => msg.messageId)
        if ('bulkDelete' in message.channel) {
          await message.channel.bulkDelete(messageIds, true)
        }
      } catch (deleteError) {
        console.error('Error bulk deleting spam messages:', deleteError)
      }

      userMessages.delete(userId)
    } catch (error) {
      console.error('Error applying anti-spam measures:', error)
    }
  }

  if (Math.random() < 0.01) {
    cleanupOldMessages()
  }
}

function cleanupOldMessages() {
  const currentTime = Date.now()
  for (const [userId, messages] of userMessages.entries()) {
    const recentMessages = messages.filter(msg => currentTime - msg.timestamp <= TIME_WINDOW)

    if (recentMessages.length === 0) {
      userMessages.delete(userId)
    } else {
      userMessages.set(userId, recentMessages)
    }
  }
}
