import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authMiddleware = async (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "未授权访问",
      });
    }

    const token = authHeader.split(" ")[1];
    const userId = await authService.verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "无效的token",
    });
  }
};
