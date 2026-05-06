import type { Message } from "../types";
export declare const messageService: {
    createMessage(sessionId: string | undefined, userId: string, content: string): Promise<{
        sessionId: string;
        message: Message;
    }>;
    createMessageStream(sessionId: string | undefined, userId: string, content: string): Promise<{
        sessionId: string;
        messageId: string;
    }>;
    saveAssistantMessage(sessionId: string, content: string): Promise<Message>;
    getMessagesBySession(sessionId: string, page?: number, limit?: number): Promise<{
        messages: Message[];
        total: number;
    }>;
    deleteMessage(messageId: string, userId: string): Promise<void>;
};
