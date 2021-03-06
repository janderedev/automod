import * as Revolt from "@janderedev/revolt.js";
import { IMonkManager } from 'monk';
import logger from '../bot/logger';
import { adminBotLog } from "../bot/logging";

class AutomodClient extends Revolt.Client {
    db: IMonkManager;

    constructor(options: Partial<Revolt.ClientOptions> | undefined, monk: IMonkManager) {
        super(options);

        this.db = monk;
    }
}

let login = (client: Revolt.Client): Promise<void> => new Promise((resolve, reject) => {
    logger.info('Bot logging in...');
    let env = process.env;

    if (!env['BOT_TOKEN']) {
        logger.error('Environment variable \'BOT_TOKEN\' not provided');
        return reject('No bot token provided');
    }

    client.loginBot(env['BOT_TOKEN']);

    client.once('ready', () => {
        logger.done(`Bot logged in as ${client.user?.username}!`);
        adminBotLog({ message: 'Bot logged in', type: 'INFO' });
        resolve();
    });

    client.on('packet', packet => {
        if (packet.type == 'InvalidSession' as any) {
            logger.error('Authentication failed: ' + JSON.stringify(packet));
            process.exit(99);
        }
    });
});

export default AutomodClient;
export { login }
