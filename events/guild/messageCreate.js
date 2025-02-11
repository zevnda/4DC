// eslint-disable-next-line no-unused-vars
import { Message } from 'discord.js';
import linkCooldown from '../../modules/moderation/link_cooldown.js';
import blSpam from '../../modules/moderation/spam_filter.js';
import rankXP from '../../modules/misc/rank_xp.js';
import stickyMessage from '../../modules/misc/sticky_message.js';
import introductionCheck from '../../modules/moderation/log_introduction.js';

export default {
    name: 'messageCreate',
    /**
     * @param {Message} message
     */
    async execute(message, client) {
        // Ignore DM messages
        if (message?.channel.type === 1) return;

        // Blacklist checks
        linkCooldown(message, client);
        blSpam(message, client);

        // Misc checks
        rankXP(message, client);
        stickyMessage(message, client);
        introductionCheck(message);

        // Forward message to message log channel
        if (!message?.author.bot) {
            const logChan = client.channels.cache.get(process.env.MSGLOG_CHAN);
            message.forward(logChan).catch(err => console.error('There was a problem forwarding a message: ', err));
        }

        // Block all youtube video links from being posted in the introduction channel
        if (message?.channel.id === process.env.INTRO_CHAN && !message?.author.bot) {
            if (message?.content.includes('youtu.be/') || message?.content.includes('youtube.com/watch')) {
                message?.delete().catch(err => console.error('There was a problem deleting a message: ', err));
            } else {
                message?.react('👋').catch(err => console.error('There was a problem deleting a message: ', err));
            }
        }
    },
};
