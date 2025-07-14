import type { Message } from 'discord.js'

const PLATFORM_CONFIG = [
  {
    env: 'YOUTUBE_CHANNEL_ID',
    name: 'YouTube',
    patterns: [
      /https?:\/\/(www\.)?youtube\.com\/\S+/i,
      /https?:\/\/youtu\.be\/\S+/i,
      /(?:^|\s)youtube\.com\/\S+/i,
      /(?:^|\s)youtu\.be\/\S+/i,
    ],
  },
  {
    env: 'TWITCH_CHANNEL_ID',
    name: 'Twitch',
    patterns: [/https?:\/\/(www\.)?twitch\.tv\/\S+/i, /(?:^|\s)twitch\.tv\/\S+/i],
  },
  {
    env: 'TIKTOK_CHANNEL_ID',
    name: 'TikTok',
    patterns: [/https?:\/\/(www\.)?tiktok\.com\/\S+/i, /(?:^|\s)tiktok\.com\/\S+/i],
  },
  {
    env: 'INSTAGRAM_CHANNEL_ID',
    name: 'Instagram',
    patterns: [/https?:\/\/(www\.)?instagram\.com\/\S+/i, /(?:^|\s)instagram\.com\/\S+/i],
  },
  {
    env: 'TWITTER_CHANNEL_ID',
    name: 'Twitter',
    patterns: [
      /https?:\/\/(www\.)?twitter\.com\/\S+/i,
      /https?:\/\/x\.com\/\S+/i,
      /(?:^|\s)twitter\.com\/\S+/i,
      /(?:^|\s)x\.com\/\S+/i,
    ],
  },
  {
    env: 'KICK_CHANNEL_ID',
    name: 'Kick',
    patterns: [/https?:\/\/(www\.)?kick\.com\/\S+/i, /(?:^|\s)kick\.com\/\S+/i],
  },
  {
    env: 'SNAPCHAT_CHANNEL_ID',
    name: 'Snapchat',
    patterns: [/https?:\/\/(www\.)?snapchat\.com\/\S+/i, /(?:^|\s)snapchat\.com\/\S+/i],
  },
]

function getChannelPlatform(channelId: string | null | undefined) {
  if (!channelId) return null
  for (const config of PLATFORM_CONFIG) {
    if (process.env[config.env] === channelId) {
      return config
    }
  }
  return null
}

function findLinkPlatform(content: string) {
  for (const config of PLATFORM_CONFIG) {
    for (const pattern of config.patterns) {
      if (pattern.test(content)) {
        return config
      }
    }
  }
  return null
}

function containsAnyPlatformLink(content: string) {
  for (const config of PLATFORM_CONFIG) {
    for (const pattern of config.patterns) {
      if (pattern.test(content)) {
        return true
      }
    }
  }
  return false
}

const DISCORD_INVITE_REGEX =
  /https?:\/\/(www\.)?(discord\.gg|discord(app)?\.com\/invite|discord\.com\/invite)\/[A-Za-z0-9-]+/i

export async function handleLinkModeration(message: Message) {
  if (message.author.bot) return
  if (!message.guild) return
  if (message.author.id === '438434841617367080') return

  const channelId = message.channel.id
  const content = message.content

  const BOOSTER_CHANNEL_ID = process.env.BOOSTER_CHANNEL_ID
  const OTHER_CHANNEL_ID = process.env.OTHER_CHANNEL_ID

  if (DISCORD_INVITE_REGEX.test(content) && channelId !== OTHER_CHANNEL_ID) {
    try {
      await message.delete()
      if (message.channel.isSendable()) {
        const warnMsg = await message.channel.send({
          content: `<@${message.author.id}> Please post **Discord Invite** links only in <#${process.env.OTHER_CHANNEL_ID}>.`,
          allowedMentions: { users: [message.author.id] },
        })
        setTimeout(() => warnMsg.delete().catch(() => {}), 5000)
      }
    } catch (err) {
      console.error('Error deleting message or sending warning:', err)
    }
    return
  }

  if (channelId === BOOSTER_CHANNEL_ID) {
    if (!containsAnyPlatformLink(content)) {
      try {
        await message.delete()
        if (message.channel.isSendable()) {
          const warnMsg = await message.channel.send({
            content: `<@${message.author.id}> Only content creation specific links are allowed in this channel.`,
            allowedMentions: { users: [message.author.id] },
          })
          setTimeout(() => warnMsg.delete().catch(() => {}), 5000)
        }
      } catch (err) {
        console.error('Error deleting message or sending warning:', err)
      }
    }
    return
  }

  const linkPlatform = findLinkPlatform(content)
  if (!linkPlatform) return

  const channelPlatform = getChannelPlatform(channelId)

  if (!channelPlatform || channelPlatform.env !== linkPlatform.env) {
    try {
      await message.delete()
      if (message.channel.isSendable()) {
        const warnMsg = await message.channel.send({
          content: `<@${message.author.id}> Please post **${linkPlatform.name}** links only in <#${process.env[linkPlatform.env]}>.`,
          allowedMentions: { users: [message.author.id] },
        })
        setTimeout(() => warnMsg.delete().catch(() => {}), 5000)
      }
    } catch (err) {
      console.error('Error deleting message or sending warning:', err)
    }
  }
}
