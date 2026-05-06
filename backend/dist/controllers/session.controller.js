"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionController = void 0;
const express_validator_1 = require("express-validator");
const session_service_1 = require("../services/session.service");
exports.sessionController = {
    validateCreateSession: [
        (0, express_validator_1.body)("title")
            .optional()
            .isLength({ max: 50 })
            .withMessage("标题不能超过50字符"),
    ],
    async createSession(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: "输入验证失败",
                    errors: errors.array(),
                });
            }
            const userId = req.userId;
            const { title } = req.body;
            const session = await session_service_1.sessionService.createSession(userId, title);
            res.status(201).json({
                success: true,
                data: session,
                message: "会话创建成功",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    async getSessions(req, res) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await session_service_1.sessionService.getSessions(userId, page, limit);
            res.json({
                success: true,
                data: result,
                message: "会话列表获取成功",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    async getSession(req, res) {
        try {
            const userId = req.userId;
            const { sessionId } = req.params;
            const session = await session_service_1.sessionService.getSession(sessionId, userId);
            res.json({
                success: true,
                data: session,
                message: "会话获取成功",
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
    async updateSession(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: "输入验证失败",
                    errors: errors.array(),
                });
            }
            const userId = req.userId;
            const { sessionId } = req.params;
            const { title } = req.body;
            const session = await session_service_1.sessionService.updateSession(sessionId, userId, title);
            res.json({
                success: true,
                data: session,
                message: "会话更新成功",
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
    async deleteSession(req, res) {
        try {
            const userId = req.userId;
            const { sessionId } = req.params;
            await session_service_1.sessionService.deleteSession(sessionId, userId);
            res.json({
                success: true,
                data: null,
                message: "会话删除成功",
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
//# sourceMappingURL=session.controller.js.map