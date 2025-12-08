import type { Message } from 'discord.js'

export async function handleNoChatChannel(message: Message) {
  const noChatChannels = [
    '1447453698358775910', // self-roles
    '1446718123167186964', // giveaways
  ]

  if (message.author.bot || message.author.id === '438434841617367080') return

  if (noChatChannels.includes(message.channel.id)) {
    try {
      await message.delete()
    } catch (error) {
      console.error('Error deleting message in no-chat channel:', error)
    }
  }
}
