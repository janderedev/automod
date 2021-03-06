import { Message } from "@janderedev/revolt.js/dist/maps/Messages";
import { Server } from "@janderedev/revolt.js/dist/maps/Servers";
import logger from "../bot/logger";

class MessageCommandContext extends Message {
    // The server to which the command should be applied.
    serverContext: Server;

    /* Override types */

    content: string;
}

export default MessageCommandContext;
