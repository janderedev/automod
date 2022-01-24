import { Request, Response } from "express";
import { FindOneResult } from "monk";
import { db } from ".";

class Session {
    user: string;
    token: string;
    nonce: string;
    expires: number;
    invalid: boolean;
}

/**
 * 
 * @param req 
 * @returns false if not authenticated, otherwise the (Revolt) user ID
 */
async function isAuthenticated(req: Request, res?: Response, send401?: boolean): Promise<string|false> {
    const user = req.header('x-auth-user');
    const token = req.header('x-auth-token');

    if (!user || !token) return false;

    const info = await getSessionInfo(user, token);
    if (res && send401 && !info.valid) {
        res.status(401).send({ error: 'Unauthorized' });
    }
    return info.valid ? user : false;
}

type SessionInfo = { exists: boolean, valid: boolean, nonce?: string }

async function getSessionInfo(user: string, token: string): Promise<SessionInfo> {
    const session: FindOneResult<Session> = await db.get('sessions').findOne({ user, token });
    
    return { exists: !!session, valid: !!(session && !session.invalid && session.expires > Date.now()), nonce: session?.nonce }
}

export { isAuthenticated, getSessionInfo }
