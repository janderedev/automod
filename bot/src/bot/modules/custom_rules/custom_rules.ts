import { Message } from "@janderedev/revolt.js/dist/maps/Messages";
import { dbs } from "../../..";
import logger from "../../logger";
import messageContentTrigger from "./message_content_trigger";

import custom_sendMessage from "./actions/sendMessage";
import custom_delete from "./actions/delete";
import custom_warn from "./actions/warn";
import { getOwnMemberInServer, hasPermForChannel } from "../../util";

async function checkCustomRules(message: Message, isEdit: boolean = false) {
    try {
        let serverConfig = await dbs.SERVERS.findOne({ id: message.channel!.server_id! });
        let rules = serverConfig?.automodSettings?.custom;
        if (!rules) return;

        for (let rule of rules) {
            if (!rule?.trigger?.on) continue;
            let onEdit = rule.trigger.on.includes('message/update');
            let onNew  = rule.trigger.on.includes('message/create');

            // tired
            if (!((onEdit && isEdit) || (onNew && !isEdit) || (onNew && onEdit))) break;

            if (await messageContentTrigger(message, rule.trigger)) {
                for (const action of rule.action) {
                    switch(action.action) {
                        case 'sendMessage':
                            if (hasPermForChannel(await getOwnMemberInServer(message.channel!.server!), message.channel!, 'SendMessage'))
                                await custom_sendMessage(message, action);
                            else
                                logger.warn(`Custom rule ${rule._id}: 'sendMessage' action lacks permission`);
                        break;
                        case 'delete':
                            if (hasPermForChannel(await getOwnMemberInServer(message.channel!.server!), message.channel!, 'ManageMessages'))
                                await custom_delete(message, action);
                            else
                                logger.warn(`Custom rule ${rule._id}: 'delete' action lacks permission`);
                        break;
                        case 'warn':
                            if (hasPermForChannel(await getOwnMemberInServer(message.channel!.server!), message.channel!, 'SendMessage'))
                                await custom_warn(message, action);
                            else
                                logger.warn(`Custom rule ${rule._id}: 'warn' action lacks permission`);
                        break;
                        default:
                            logger.warn(`Unknown action ${action.action} in custom rule ${rule._id} in server ${message.channel?.server_id}`);
                    }
                }
            }
        }
    } catch(e) {
        console.error(''+e);
    }
}

export default checkCustomRules;
