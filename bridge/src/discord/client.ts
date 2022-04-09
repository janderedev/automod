import Discord from "discord.js";
import { logger } from "..";

const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_MESSAGES',
        'GUILD_MEMBERS',
        'GUILD_WEBHOOKS',
    ],
    allowedMentions: { parse: [ ] }, // how the hell does this work
});

const login = () => new Promise((resolve: (value: Discord.Client) => void) => {
    client.login(process.env['DISCORD_TOKEN']!);
    client.once('ready', () => {
        logger.info(`Discord: ${client.user?.username} ready - ${client.guilds.cache.size} servers`);
    });
});

import('./events');

export { client, login }