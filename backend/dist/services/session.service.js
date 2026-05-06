"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = require("../config/logger");
exports.sessionService = {
    async createSession(userId, title) {
        const session = await prisma_1.prisma.session.create({
            data: {
                userId,
                title: title || "新对话",
            },
        });
        logger_1.logger.info(`会话创建成功: ${session.id}`);
        return {
            id: session.id,
            userId: session.userId,
            title: session.title,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        };
    },
    async getSessions(userId, page = 1, limit = 20) {
        const [sessions, total] = await Promise.all([
            prisma_1.prisma.session.findMany({
                where: { userId },
                orderBy: { updatedAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.prisma.session.count({ where: { userId } }),
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
    async getSession(sessionId, userId) {
        const session = await prisma_1.prisma.session.findUnique({
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
    async updateSession(sessionId, userId, title) {
        const session = await prisma_1.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session || session.userId !== userId) {
            throw new Error("会话不存在或无权访问");
        }
        const updatedSession = await prisma_1.prisma.session.update({
            where: { id: sessionId },
            data: { title, updatedAt: new Date() },
        });
        logger_1.logger.info(`会话更新成功: ${sessionId}`);
        return {
            id: updatedSession.id,
            userId: updatedSession.userId,
            title: updatedSession.title,
            createdAt: updatedSession.createdAt,
            updatedAt: updatedSession.updatedAt,
        };
    },
    async deleteSession(sessionId, userId) {
        const session = await prisma_1.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session || session.userId !== userId) {
            throw new Error("会话不存在或无权访问");
        }
        await prisma_1.prisma.session.delete({ where: { id: sessionId } });
        logger_1.logger.info(`会话删除成功: ${sessionId}`);
    },
};
//# sourceMappingURL=session.service.js.map