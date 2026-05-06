import { prisma } from "../config/prisma";
import { logger } from "../config/logger";
import type { Message } from "../types";

export const messageService = {
  async createMessage(
    sessionId: string | undefined,
    userId: string,
    content: string,
  ): Promise<{ sessionId: string; message: Message }> {
    let actualSessionId: string;

    if (!sessionId) {
      const session = await prisma.session.create({
        data: { userId, title: "新对话" },
      });
      actualSessionId = session.id;
    } else {
      actualSessionId = sessionId;
    }

    const message = await prisma.message.create({
      data: {
        sessionId: actualSessionId,
        role: "user",
        content,
      },
    });

    await prisma.session.update({
      where: { id: actualSessionId },
      data: { updatedAt: new Date() },
    });

    logger.info(`消息创建成功: ${message.id}`);
    return {
      sessionId: actualSessionId,
      message: {
        id: message.id,
        sessionId: message.sessionId,
        role: message.role as "user" | "assistant",
        content: message.content,
        createdAt: message.createdAt,
      },
    };
  },

  async createMessageStream(
    sessionId: string | undefined,
    userId: string,
    content: string,
  ): Promise<{ sessionId: string; messageId: string }> {
    let actualSessionId: string;

    if (!sessionId) {
      const session = await prisma.session.create({
        data: { userId, title: "新对话" },
      });
      actualSessionId = session.id;
    } else {
      actualSessionId = sessionId;
    }

    const message = await prisma.message.create({
      data: {
        sessionId: actualSessionId,
        role: "user",
        content,
      },
    });

    await prisma.session.update({
      where: { id: actualSessionId },
      data: { updatedAt: new Date() },
    });

    return { sessionId: actualSessionId, messageId: message.id };
  },

  async saveAssistantMessage(
    sessionId: string,
    content: string,
  ): Promise<Message> {
    const message = await prisma.message.create({
      data: {
        sessionId,
        role: "assistant",
        content,
      },
    });

    await prisma.session.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return {
      id: message.id,
      sessionId: message.sessionId,
      role: message.role as "user" | "assistant",
      content: message.content,
      createdAt: message.createdAt,
    };
  },

  async getMessagesBySession(
    sessionId: string,
    page = 1,
    limit = 50,
  ): Promise<{ messages: Message[]; total: number }> {
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where: { sessionId } }),
    ]);

    return {
      messages: messages.map((msg) => ({
        id: msg.id,
        sessionId: msg.sessionId,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        createdAt: msg.createdAt,
      })),
      total,
    };
  },

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { session: true },
    });

    if (!message || message.session.userId !== userId) {
      throw new Error("无权删除此消息");
    }

    await prisma.message.delete({ where: { id: messageId } });
    logger.info(`消息删除成功: ${messageId}`);
  },
};
