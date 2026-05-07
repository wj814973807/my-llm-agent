/**
 * 消息控制器 - 处理消息相关的HTTP请求
 *
 * 功能说明：
 * - 发送消息（非流式）
 * - 发送消息（流式，打字机效果）
 * - 获取会话消息列表
 * - 删除消息
 *
 * 路由配置：
 * - POST /api/messages - 发送消息（非流式）
 * - POST /api/messages/stream - 发送消息（流式）
 * - GET /api/messages/:sessionId - 获取消息列表
 * - DELETE /api/messages/:messageId - 删除消息
 */

import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { messageService } from "../services/message.service";
import { aiService } from "../services/ai.service";
import { prisma } from "../config/prisma";
import { logger } from "../config/logger";
import type { Message } from "../types";

export const messageController = {
  /**
   * 消息发送验证规则
   */
  validateSendMessage: [
    body("content")
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage("消息内容不能为空且不超过2000字符"),
    body("sessionId")
      .optional()
      .isString()
      .withMessage("sessionId必须是字符串"),
  ],

  /**
   * 发送消息（非流式）
   *
   * @param req - 请求对象，包含sessionId（可选）和content
   * @param res - 响应对象
   */
  async sendMessage(req: Request & { userId?: string }, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "输入验证失败",
          errors: errors.array(),
        });
      }

      const { sessionId, content } = req.body;
      const userId = req.userId!;

      const { sessionId: actualSessionId, message } =
        await messageService.createMessage(sessionId, userId, content);

      const history = (await prisma.message.findMany({
        where: { sessionId: actualSessionId },
        orderBy: { createdAt: "asc" },
      })) as unknown as Message[];

      const aiResponse = await aiService.generateResponse(
        actualSessionId,
        history,
        content,
      );
      await messageService.saveAssistantMessage(actualSessionId, aiResponse);

      res.json({
        success: true,
        data: {
          sessionId: actualSessionId,
          userMessage: message,
          assistantMessage: aiResponse,
        },
        message: "消息发送成功",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  /**
   * 发送消息（流式）
   *
   * 使用Server-Sent Events(SSE)实现打字机效果
   *
   * @param req - 请求对象，包含sessionId（可选）和content
   * @param res - 响应对象
   */
  async streamMessage(req: Request & { userId?: string }, res: Response) {
    const { sessionId, content } = req.body;
    const userId = req.userId!;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    try {
      const { sessionId: actualSessionId, messageId } =
        await messageService.createMessageStream(sessionId, userId, content);

      const history = (await prisma.message.findMany({
        where: { sessionId: actualSessionId },
        orderBy: { createdAt: "asc" },
      })) as unknown as Message[];

      let fullContent = "";

      for await (const token of aiService.generateStreamResponse(
        actualSessionId,
        history,
        content,
      )) {
        res.write(
          `data: ${JSON.stringify({ type: "token", content: token })}\n\n`,
        );
        fullContent += token;
      }

      await messageService.saveAssistantMessage(actualSessionId, fullContent);

      res.write(`data: ${JSON.stringify({ type: "done", messageId })}\n\n`);
      res.end();
    } catch (error: any) {
      logger.error(error, "流式响应错误");
      res.write(
        `data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`,
      );
      res.end();
    }
  },

  /**
   * 获取会话消息列表
   *
   * @param req - 请求对象，包含sessionId参数和分页参数
   * @param res - 响应对象
   */
  async getMessages(req: Request & { userId?: string }, res: Response) {
    try {
      const { sessionId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await messageService.getMessagesBySession(
        sessionId,
        page,
        limit,
      );

      res.json({
        success: true,
        data: result,
        message: "消息获取成功",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  /**
   * 删除消息
   *
   * @param req - 请求对象，包含messageId参数
   * @param res - 响应对象
   */
  async deleteMessage(req: Request & { userId?: string }, res: Response) {
    try {
      const { messageId } = req.params;
      const userId = req.userId!;

      await messageService.deleteMessage(messageId, userId);

      res.json({
        success: true,
        data: null,
        message: "消息删除成功",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
