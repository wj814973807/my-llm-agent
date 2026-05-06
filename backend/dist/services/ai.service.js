"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const chains_1 = require("langchain/chains");
const memory_1 = require("langchain/memory");
const logger_1 = require("../config/logger");
const QIAN_API_KEY = process.env.QIAN_API_KEY;
exports.aiService = {
    async generateResponse(sessionId, history, userMessage) {
        try {
            const llm = new openai_1.ChatOpenAI({
                model: "gpt-3.5-turbo",
                apiKey: QIAN_API_KEY || "dummy-key",
                temperature: 0.7,
            });
            const prompt = prompts_1.ChatPromptTemplate.fromMessages([
                [
                    "system",
                    "你是一个专业的AI客服助手，名为小Q。请用友好、专业的语言回答用户的问题。",
                ],
                new prompts_1.MessagesPlaceholder("history"),
                ["human", "{input}"],
            ]);
            const memory = new memory_1.BufferMemory({
                returnMessages: true,
                memoryKey: "history",
            });
            const chain = new chains_1.ConversationChain({
                llm,
                prompt,
                memory,
            });
            for (const msg of history) {
                const role = msg.role === "user" ? "human" : "ai";
                memory.chatHistory.addMessage({
                    type: role,
                    content: msg.content,
                });
            }
            const result = await chain.invoke({ input: userMessage });
            return result.response;
        }
        catch (error) {
            logger_1.logger.error(`AI响应生成失败: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error("AI服务暂时不可用，请稍后重试");
        }
    },
    async *generateStreamResponse(sessionId, history, userMessage) {
        try {
            const llm = new openai_1.ChatOpenAI({
                model: "gpt-3.5-turbo",
                apiKey: QIAN_API_KEY || "dummy-key",
                temperature: 0.7,
                streaming: true,
            });
            const prompt = prompts_1.ChatPromptTemplate.fromMessages([
                [
                    "system",
                    "你是一个专业的AI客服助手，名为小Q。请用友好、专业的语言回答用户的问题。",
                ],
                new prompts_1.MessagesPlaceholder("history"),
                ["human", "{input}"],
            ]);
            const memory = new memory_1.BufferMemory({
                returnMessages: true,
                memoryKey: "history",
            });
            for (const msg of history) {
                const role = msg.role === "user" ? "human" : "ai";
                memory.chatHistory.addMessage({
                    type: role,
                    content: msg.content,
                });
            }
            const chain = new chains_1.ConversationChain({
                llm,
                prompt,
                memory,
            });
            const stream = await chain.stream({ input: userMessage });
            for await (const chunk of stream) {
                if (typeof chunk === "string") {
                    yield chunk;
                }
                else if (chunk.response) {
                    yield chunk.response;
                }
            }
        }
        catch (error) {
            logger_1.logger.error(`AI流式响应生成失败: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error("AI服务暂时不可用，请稍后重试");
        }
    },
};
//# sourceMappingURL=ai.service.js.map