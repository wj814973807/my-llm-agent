import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { sessionService } from "../services/session.service";

export const sessionController = {
  validateCreateSession: [
    body("title")
      .optional()
      .isLength({ max: 50 })
      .withMessage("标题不能超过50字符"),
  ],

  async createSession(req: Request & { userId?: string }, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "输入验证失败",
          errors: errors.array(),
        });
      }

      const userId = req.userId!;
      const { title } = req.body;

      const session = await sessionService.createSession(userId, title);

      res.status(201).json({
        success: true,
        data: session,
        message: "会话创建成功",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getSessions(req: Request & { userId?: string }, res: Response) {
    try {
      const userId = req.userId!;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await sessionService.getSessions(userId, page, limit);

      res.json({
        success: true,
        data: result,
        message: "会话列表获取成功",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getSession(req: Request & { userId?: string }, res: Response) {
    try {
      const userId = req.userId!;
      const { sessionId } = req.params;

      const session = await sessionService.getSession(sessionId, userId);

      res.json({
        success: true,
        data: session,
        message: "会话获取成功",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async updateSession(req: Request & { userId?: string }, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "输入验证失败",
          errors: errors.array(),
        });
      }

      const userId = req.userId!;
      const { sessionId } = req.params;
      const { title } = req.body;

      const session = await sessionService.updateSession(
        sessionId,
        userId,
        title,
      );

      res.json({
        success: true,
        data: session,
        message: "会话更新成功",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async deleteSession(req: Request & { userId?: string }, res: Response) {
    try {
      const userId = req.userId!;
      const { sessionId } = req.params;

      await sessionService.deleteSession(sessionId, userId);

      res.json({
        success: true,
        data: null,
        message: "会话删除成功",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
