"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const express_validator_1 = require("express-validator");
const message_service_1 = require("../services/message.service");
const ai_service_1 = require("../services/ai.service");
const prisma_1 = require("../config/prisma");
exports.messageController = {
    validateSendMessage: [
        (0, express_validator_1.body)("content")
            .trim()
            .isLength({ min: 1, max: 2000 })
            .withMessage("消息内容不能为空且不超过2000字符"),
        (0, express_validator_1.body)("sessionId")
            .optional()
            .isString()
            .withMessage("sessionId必须是字符串"),
    ],
    async sendMessage(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: "输入验证失败",
                    errors: errors.array(),
                });
            }
            const { sessionId, content } = req.body;
            const userId = req.userId;
            const { sessionId: actualSessionId, message } = await message_service_1.messageService.createMessage(sessionId, userId, content);
            const history = (await prisma_1.prisma.message.findMany({
                where: { sessionId: actualSessionId },
                orderBy: { createdAt: "asc" },
            }));
            const aiResponse = await ai_service_1.aiService.generateResponse(actualSessionId, history, content);
            await message_service_1.messageService.saveAssistantMessage(actualSessionId, aiResponse);
            res.json({
                success: true,
                data: {
                    sessionId: actualSessionId,
                    userMessage: message,
                    assistantMessage: aiResponse,
                },
                message: "消息发送成功",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    async streamMessage(req, res) {
        const { sessionId, content } = req.body;
        const userId = req.userId;
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        try {
            const { sessionId: actualSessionId, messageId } = await message_service_1.messageService.createMessageStream(sessionId, userId, content);
            const history = (await prisma_1.prisma.message.findMany({
                where: { sessionId: actualSessionId },
                orderBy: { createdAt: "asc" },
            }));
            let fullContent = "";
            for await (const token of ai_service_1.aiService.generateStreamResponse(actualSessionId, history, content)) {
                res.write(`data: ${JSON.stringify({ type: "token", content: token })}\n\n`);
                fullContent += token;
            }
            await message_service_1.messageService.saveAssistantMessage(actualSessionId, fullContent);
            res.write(`data: ${JSON.stringify({ type: "done", messageId })}\n\n`);
            res.end();
        }
        catch (error) {
            console.error("流式响应错误:", error);
            res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
            res.end();
        }
    },
    async getMessages(req, res) {
        try {
            const { sessionId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await message_service_1.messageService.getMessagesBySession(sessionId, page, limit);
            res.json({
                success: true,
                data: result,
                message: "消息获取成功",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.userId;
            await message_service_1.messageService.deleteMessage(messageId, userId);
            res.json({
                success: true,
                data: null,
                message: "消息删除成功",
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
};
//# sourceMappingURL=message.controller.js.map