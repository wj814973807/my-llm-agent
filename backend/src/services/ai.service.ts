/**
 * AI服务模块 - 封装LangChain与Qwen大模型的交互逻辑
 *
 * 功能说明：
 * - 使用阿里云Qwen-Plus模型提供AI对话能力
 * - 支持普通响应和流式响应两种模式
 * - 维护对话历史上下文，实现聊天记忆功能
 *
 * 技术实现：
 * - 基于LangChain Expression Language (LCEL)构建
 * - 使用ChatPromptTemplate构建对话模板
 * - 支持流式输出，实现打字机效果
 *
 * 环境变量：
 * - QIAN_API_KEY: 阿里云DashScope API密钥
 * - QIAN_API_BASE: API基础地址（默认：https://dashscope.aliyuncs.com/compatible-mode/v1）
 */

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
  /**
   * 生成AI响应（非流式）
   *
   * @param sessionId - 会话ID
   * @param history - 对话历史消息数组
   * @param userMessage - 用户输入消息
   * @returns AI响应内容
   */
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

  /**
   * 生成流式AI响应（打字机效果）
   *
   * @param sessionId - 会话ID
   * @param history - 对话历史消息数组
   * @param userMessage - 用户输入消息
   * @returns 异步生成器，逐块返回AI响应内容
   */
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
