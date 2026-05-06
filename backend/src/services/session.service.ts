import { prisma } from "../config/prisma";
import { logger } from "../config/logger";
import type { Session } from "../types";

export const sessionService = {
  async createSession(userId: string, title?: string): Promise<Session> {
    const session = await prisma.session.create({
      data: {
        userId,
        title: title || "新对话",
      },
    });

    logger.info(`会话创建成功: ${session.id}`);
    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  },

  async getSessions(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ sessions: Session[]; total: number }> {
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.session.count({ where: { userId } }),
    ]);

    return {
      sessions: sessions.map((sess) => ({
        id: sess.id,
        userId: sess.userId,
        title: sess.title,
        createdAt: sess.createdAt,
        updatedAt: sess.updatedAt,
      })),
      total,
    };
  },

  async getSession(sessionId: string, userId: string): Promise<Session> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new Error("会话不存在或无权访问");
    }

    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  },

  async updateSession(
    sessionId: string,
    userId: string,
    title: string,
  ): Promise<Session> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new Error("会话不存在或无权访问");
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { title, updatedAt: new Date() },
    });

    logger.info(`会话更新成功: ${sessionId}`);
    return {
      id: updatedSession.id,
      userId: updatedSession.userId,
      title: updatedSession.title,
      createdAt: updatedSession.createdAt,
      updatedAt: updatedSession.updatedAt,
    };
  },

  async deleteSession(sessionId: string, userId: string): Promise<void> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new Error("会话不存在或无权访问");
    }

    await prisma.session.delete({ where: { id: sessionId } });
    logger.info(`会话删除成功: ${sessionId}`);
  },
};
