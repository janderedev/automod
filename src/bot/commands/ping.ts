import Command from "../../struct/Command";
import { Message } from "revolt.js/dist/maps/Messages";
import { client } from "../..";

export default {
    name: 'ping',
    aliases: null,
    description: 'ping pong',
    serverOnly: false,
    run: async (message: Message, args: string[]) => {
        let now = Date.now();
        message.reply(`Measuring...`)
            ?.catch(console.error)
            .then(msg => {
                msg?.edit({ content:  `## Ping Pong!\n`
                                    + `WS: \`${client.websocket.ping ?? '--'}ms\`\n`
                                    + `Msg: \`${Math.round(Date.now() - now) / 2}ms\`` });
        });
    }
} as Command;
