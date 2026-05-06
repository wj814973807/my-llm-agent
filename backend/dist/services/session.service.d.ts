import type { Session } from "../types";
export declare const sessionService: {
    createSession(userId: string, title?: string): Promise<Session>;
    getSessions(userId: string, page?: number, limit?: number): Promise<{
        sessions: Session[];
        total: number;
    }>;
    getSession(sessionId: string, userId: string): Promise<Session>;
    updateSession(sessionId: string, userId: string, title: string): Promise<Session>;
    deleteSession(sessionId: string, userId: string): Promise<void>;
};
