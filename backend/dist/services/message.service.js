"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = require("../config/logger");
exports.messageService = {
    async createMessage(sessionId, userId, content) {
        let actualSessionId;
        if (!sessionId) {
            const session = await prisma_1.prisma.session.create({
                data: { userId, title: "新对话" },
            });
            actualSessionId = session.id;
        }
        else {
            actualSessionId = sessionId;
        }
        const message = await prisma_1.prisma.message.create({
            data: {
                sessionId: actualSessionId,
                role: "user",
                content,
            },
        });
        await prisma_1.prisma.session.update({
            where: { id: actualSessionId },
            data: { updatedAt: new Date() },
        });
        logger_1.logger.info(`消息创建成功: ${message.id}`);
        return {
            sessionId: actualSessionId,
            message: {
                id: message.id,
                sessionId: message.sessionId,
                role: message.role,
                content: message.content,
                createdAt: message.createdAt,
            },
        };
    },
    async createMessageStream(sessionId, userId, content) {
        let actualSessionId;
        if (!sessionId) {
            const session = await prisma_1.prisma.session.create({
                data: { userId, title: "新对话" },
            });
            actualSessionId = session.id;
        }
        else {
            actualSessionId = sessionId;
        }
        const message = await prisma_1.prisma.message.create({
            data: {
                sessionId: actualSessionId,
                role: "user",
                content,
            },
        });
        await prisma_1.prisma.session.update({
            where: { id: actualSessionId },
            data: { updatedAt: new Date() },
        });
        return { sessionId: actualSessionId, messageId: message.id };
    },
    async saveAssistantMessage(sessionId, content) {
        const message = await prisma_1.prisma.message.create({
            data: {
                sessionId,
                role: "assistant",
                content,
            },
        });
        await prisma_1.prisma.session.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
        });
        return {
            id: message.id,
            sessionId: message.sessionId,
            role: message.role,
            content: message.content,
            createdAt: message.createdAt,
        };
    },
    async getMessagesBySession(sessionId, page = 1, limit = 50) {
        const [messages, total] = await Promise.all([
            prisma_1.prisma.message.findMany({
                where: { sessionId },
                orderBy: { createdAt: "asc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.prisma.message.count({ where: { sessionId } }),
        ]);
        return {
            messages: messages.map((msg) => ({
                id: msg.id,
                sessionId: msg.sessionId,
                role: msg.role,
                content: msg.content,
                createdAt: msg.createdAt,
            })),
            total,
        };
    },
    async deleteMessage(messageId, userId) {
        const message = await prisma_1.prisma.message.findUnique({
            where: { id: messageId },
            include: { session: true },
        });
        if (!message || message.session.userId !== userId) {
            throw new Error("无权删除此消息");
        }
        await prisma_1.prisma.message.delete({ where: { id: messageId } });
        logger_1.logger.info(`消息删除成功: ${messageId}`);
    },
};
//# sourceMappingURL=message.service.js.map