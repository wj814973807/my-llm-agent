import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { logger } from "../config/logger";
import type { Message } from "../types";

const QIAN_API_KEY = process.env.QIAN_API_KEY;
const QIAN_API_BASE =
  process.env.QIAN_API_BASE ||
  "https://dashscope.aliyuncs.com/compatible-mode/v1";

export const aiService = {
  async generateResponse(
    sessionId: string,
    history: Message[],
    userMessage: string,
  ): Promise<string> {
    try {
      const llm = new ChatOpenAI({
        model: "qwen-plus",
        apiKey: QIAN_API_KEY || "dummy-key",
        temperature: 0.7,
        configuration: {
          baseURL: QIAN_API_BASE,
        },
      });

      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "你是一个专业的AI客服助手，名为小Q。请用友好、专业的语言回答用户的问题。",
        ],
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
      ]);

      const chain = prompt.pipe(llm);

      const chatHistory = history.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

      const result = await chain.invoke({
        input: userMessage,
        history: chatHistory,
      });

      return result.content as string;
    } catch (error: unknown) {
      logger.error(
        `AI响应生成失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error("AI服务暂时不可用，请稍后重试");
    }
  },

  async *generateStreamResponse(
    sessionId: string,
    history: Message[],
    userMessage: string,
  ): AsyncGenerator<string> {
    try {
      const llm = new ChatOpenAI({
        model: "qwen-plus",
        apiKey: QIAN_API_KEY || "dummy-key",
        temperature: 0.7,
        streaming: true,
        configuration: {
          baseURL: QIAN_API_BASE,
        },
      });

      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "你是一个专业的AI客服助手，名为小Q。请用友好、专业的语言回答用户的问题。",
        ],
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
      ]);

      const chain = prompt.pipe(llm);

      const chatHistory = history.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

      const stream = await chain.stream({
        input: userMessage,
        history: chatHistory,
      });

      for await (const chunk of stream) {
        if (typeof chunk.content === "string") {
          yield chunk.content;
        }
      }
    } catch (error: unknown) {
      logger.error(
        `AI流式响应生成失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error("AI服务暂时不可用，请稍后重试");
    }
  },
};
