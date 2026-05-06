import type { Message } from "../types";
export declare const aiService: {
    generateResponse(sessionId: string, history: Message[], userMessage: string): Promise<string>;
    generateStreamResponse(sessionId: string, history: Message[], userMessage: string): AsyncGenerator<string>;
};
